import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Um Chrome sem janela controlado pelo protocolo de depuração, sem
 * dependência nova: usado pelo checkup visual e pela comparação com as
 * referências. Não roda no CI (precisa do Chrome instalado).
 */

export interface Message {
  id?: number;
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export interface Browser {
  send(method: string, params?: Record<string, unknown>): Promise<Message>;
  /** Avalia uma expressão na página e devolve o valor. */
  evaluate<T>(expression: string): Promise<T>;
  /** Abre o endereço e espera a página carregar. */
  load(url: string): Promise<void>;
  /** Captura a página inteira (até 4000px de altura) num PNG. */
  screenshot(file: string): Promise<void>;
  /** Recebe os eventos do Chrome (erros do console, por exemplo). */
  listen(listener: (message: Message) => void): void;
  close(): void;
}

const CHROME_PATHS = [
  process.env['CHROME_PATH'],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

/** Tempo máximo de cada comando ao Chrome: uma página travada não pode parar o script. */
const TIMEOUT = 30_000;
/** Largura da janela: a mesma das capturas. */
export const WIDTH = 1280;

export const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, fail) => {
    timer = setTimeout(
      () => fail(new Error(`${label} não respondeu em ${TIMEOUT / 1000}s`)),
      TIMEOUT,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Abre o Chrome numa janela de 1280×900; encerra o processo se o Chrome não existir. */
export async function openBrowser(): Promise<Browser> {
  const chromePath = CHROME_PATHS.find((path) => path && existsSync(path));
  if (!chromePath) {
    console.error('Chrome não encontrado. Informe o caminho em CHROME_PATH.');
    process.exit(2);
  }

  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = mkdtempSync(join(tmpdir(), 'argila-navegador-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--hide-scrollbars',
    'about:blank',
  ]);

  async function devtools<T>(path: string, method = 'GET'): Promise<T> {
    for (let attempt = 0; attempt < 50; attempt++) {
      try {
        return (await (await fetch(`http://127.0.0.1:${port}${path}`, { method })).json()) as T;
      } catch {
        await sleep(200);
      }
    }
    throw new Error('o Chrome não respondeu');
  }

  await devtools('/json/version');
  const target = await devtools<{ webSocketDebuggerUrl: string }>('/json/new?about:blank', 'PUT');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map<number, (message: Message) => void>();
  const listeners: ((message: Message) => void)[] = [];
  let nextId = 0;
  socket.onmessage = (event) => {
    const message = JSON.parse(String(event.data)) as Message;
    if (message.id !== undefined) pending.get(message.id)?.(message);
    else listeners.forEach((listener) => listener(message));
  };
  await new Promise((done) => (socket.onopen = done));

  function send(method: string, params: Record<string, unknown> = {}): Promise<Message> {
    const id = ++nextId;
    const answer = new Promise<Message>((done) => {
      pending.set(id, done);
      socket.send(JSON.stringify({ id, method, params }));
    });
    return withTimeout(answer, method).finally(() => pending.delete(id));
  }

  function nextEvent(method: string): Promise<Message> {
    return new Promise((done) =>
      listeners.push((message) => message.method === method && done(message)),
    );
  }

  async function evaluate<T>(expression: string): Promise<T> {
    const { result } = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    const details = result?.['exceptionDetails'] as { text?: string } | undefined;
    if (details) throw new Error(details.text ?? 'erro na página');
    return (result?.['result'] as { value: T }).value;
  }

  async function load(url: string): Promise<void> {
    const loaded = nextEvent('Page.loadEventFired');
    await send('Page.navigate', { url });
    await withTimeout(loaded, `carregar ${url}`);
    await sleep(1500);
  }

  async function screenshot(file: string): Promise<void> {
    const metrics = await send('Page.getLayoutMetrics');
    const size = metrics.result?.['cssContentSize'] as { width: number; height: number };
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: WIDTH, height: Math.min(size.height, 4000), scale: 1 },
    });
    writeFileSync(file, Buffer.from(String(shot.result?.['data']), 'base64'));
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  return {
    send,
    evaluate,
    load,
    screenshot,
    listen: (listener) => listeners.push(listener),
    close: () => {
      socket.close();
      chrome.kill();
    },
  };
}

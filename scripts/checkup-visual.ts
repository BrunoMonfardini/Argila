/**
 * Checkup visual do catálogo, num Chrome sem janela.
 *
 * Com o catálogo rodando (`npm run dev`), percorre cada página em cada
 * combinação de estilo × paleta × modo, escolhendo o tema pela própria barra
 * do catálogo. Em cada página: erros no console, rolagem horizontal e
 * contraste do texto renderizado; e uma captura de tela. O resultado fica em
 * checkup/relatorio.html.
 *
 *   node scripts/checkup-visual.ts [--url http://localhost:4200] [--estilos coda,molde]
 *                                  [--paletas nativa] [--paginas button,card] [--saida checkup]
 *
 * Termina com código 1 se houver erro, rolagem ou falha na barra de tema;
 * contraste baixo entra no relatório, mas não falha (fundos com imagem e
 * sobreposições confundem a medida).
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  type Combination,
  type Issue,
  auditPage,
  combinationName,
  combinations,
  pageFile,
  reportHtml,
} from './lib/checkup.ts';
import { loadDesignSystems } from './lib/design-systems.ts';

const { values: options } = parseArgs({
  options: {
    url: { type: 'string', default: 'http://localhost:4200' },
    saida: { type: 'string', default: 'checkup' },
    estilos: { type: 'string' },
    paletas: { type: 'string' },
    paginas: { type: 'string' },
  },
});
const list = (value?: string) => value?.split(',').map((item) => item.trim());

const ROOT = resolve(import.meta.dirname, '..');
const onlyStyles = list(options.estilos);
const designSystems = (await loadDesignSystems(ROOT)).filter(
  (ds) => !onlyStyles || onlyStyles.includes(ds.id),
);
const combos = combinations(designSystems, list(options.paletas));
const output = resolve(ROOT, options.saida);

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const chromePath = CHROME_PATHS.find((path) => path && existsSync(path));
if (!chromePath) {
  console.error('Chrome não encontrado. Informe o caminho em CHROME_PATH.');
  process.exit(2);
}

const PORT = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'argila-checkup-'));
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  '--hide-scrollbars',
  'about:blank',
]);

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

async function devtools<T>(path: string, method = 'GET'): Promise<T> {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      return (await (await fetch(`http://127.0.0.1:${PORT}${path}`, { method })).json()) as T;
    } catch {
      await sleep(200);
    }
  }
  throw new Error('o Chrome não respondeu');
}

interface Message {
  id?: number;
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
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

/** Tempo máximo de cada comando ao Chrome: uma página travada não pode parar o checkup. */
const TIMEOUT = 30_000;

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

/** Avalia uma expressão na página e devolve o valor. */
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

/** Navega pelo roteador do catálogo, sem recarregar. */
async function visit(path: string): Promise<void> {
  await evaluate(
    `history.pushState(null, '', ${JSON.stringify(path)}); dispatchEvent(new PopStateEvent('popstate')); 0`,
  );
  await sleep(700);
  await evaluate('document.fonts.ready.then(() => 0)');
}

/** Escolhe o tema pela barra do catálogo, como uma pessoa faria; devolve o que não bateu. */
async function applyTheme(combo: Combination): Promise<string[]> {
  return evaluate<string[]>(`(async () => {
    const bar = document.querySelector('doc-theme-bar');
    const field = (label) => [...bar.querySelectorAll('label')]
      .find((l) => l.querySelector('span')?.textContent === label)?.querySelector('select');
    const choose = (select, value) => { select.value = value; select.dispatchEvent(new Event('change')); };
    choose(field('Estilo'), ${JSON.stringify(combo.style)});
    // A lista de paletas muda com o estilo: espera ela ser redesenhada
    await new Promise((done) => setTimeout(done, 100));
    choose(field('Paleta'), ${JSON.stringify(combo.palette)});
    const label = ${JSON.stringify(combo.scheme === 'light' ? 'Claro' : 'Escuro')};
    [...bar.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click();
    await new Promise((done) => setTimeout(done, 300));
    const root = document.documentElement;
    const problems = [];
    const expect = (what, actual, expected) => actual !== expected && problems.push(
      what + ': esperado "' + expected + '", veio "' + actual + '"');
    expect('data-arg-style', root.getAttribute('data-arg-style'), ${JSON.stringify(combo.style)});
    expect('data-arg-palette', root.getAttribute('data-arg-palette'), ${JSON.stringify(combo.palette)});
    expect('data-arg-theme', root.getAttribute('data-arg-theme'), ${JSON.stringify(combo.scheme)});
    expect('seletor de estilo', field('Estilo').value, ${JSON.stringify(combo.style)});
    expect('seletor de paleta', field('Paleta').value, ${JSON.stringify(combo.palette)});
    return problems;
  })()`);
}

async function screenshot(file: string): Promise<void> {
  const metrics = await send('Page.getLayoutMetrics');
  const size = metrics.result?.['cssContentSize'] as { width: number; height: number };
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: 1280, height: Math.min(size.height, 4000), scale: 1 },
  });
  writeFileSync(file, Buffer.from(String(shot.result?.['data']), 'base64'));
}

let errors: string[] = [];
listeners.push((message) => {
  if (message.method === 'Runtime.exceptionThrown') {
    const details = message.params?.['exceptionDetails'] as {
      text: string;
      exception?: { description?: string };
    };
    errors.push(details.exception?.description ?? details.text);
  }
  if (message.method === 'Runtime.consoleAPICalled' && message.params?.['type'] === 'error') {
    const args = message.params['args'] as { value?: unknown; description?: string }[];
    errors.push(args.map((arg) => String(arg.value ?? arg.description)).join(' '));
  }
});

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const base = options.url.replace(/\/$/, '');
await load(`${base}/`);
const onlyPages = list(options.paginas);
const pages = (
  await evaluate<string[]>(
    `[...new Set([...document.querySelectorAll('#navegacao a[href]')].map((a) => a.getAttribute('href')))]`,
  )
).filter((page) => !onlyPages || onlyPages.some((filter) => page.includes(filter)));

rmSync(output, { recursive: true, force: true });
const issues: Issue[] = [];
const started = Date.now();
for (const combo of combos) {
  const name = combinationName(combo);
  mkdirSync(join(output, name), { recursive: true });
  // Cada combinação começa do zero: nada salvo de uma vaza para a outra
  await load(`${base}/`);
  await evaluate('localStorage.clear(); 0');
  await load(`${base}/`);
  for (const detail of await applyTheme(combo)) {
    issues.push({ page: '/', combination: name, kind: 'barra de tema', detail });
  }
  for (const page of pages) {
    errors = [];
    try {
      await checkPage(page, name);
    } catch (error) {
      // Registra e segue: recarrega o catálogo, que lembra o tema escolhido
      issues.push({
        page,
        combination: name,
        kind: 'erro',
        detail: `travou: ${(error as Error).message}`,
      });
      await load(`${base}/`);
    }
  }
  console.log(`${name}: ${pages.length} página(s)`);
}

/** Visita, audita e fotografa uma página na combinação atual. */
async function checkPage(page: string, name: string): Promise<void> {
  await visit(page);
  const audit = await evaluate<ReturnType<typeof auditPage>>(`(${auditPage.toString()})()`);
  for (const error of errors) issues.push({ page, combination: name, kind: 'erro', detail: error });
  if (audit.overflow > 0) {
    issues.push({
      page,
      combination: name,
      kind: 'rolagem',
      detail: `${audit.overflow}px a mais na largura`,
    });
  }
  for (const low of audit.lowContrast) {
    issues.push({
      page,
      combination: name,
      kind: 'contraste',
      detail: `${low.element} "${low.text}": ${low.color} sobre ${low.background} = ${low.ratio}:1 (mínimo ${low.minimum}:1)`,
    });
  }
  await screenshot(join(output, name, `${pageFile(page)}.png`));
}

writeFileSync(join(output, 'relatorio.html'), reportHtml(pages, combos, issues));
writeFileSync(join(output, 'problemas.json'), JSON.stringify(issues, null, 2));
socket.close();
chrome.kill();

const count = (kind: Issue['kind']) => issues.filter((issue) => issue.kind === kind).length;
console.log(
  `\n${pages.length} página(s) × ${combos.length} combinação(ões) em ${Math.round((Date.now() - started) / 1000)}s.`,
);
console.log(
  `Erros: ${count('erro')} · rolagem: ${count('rolagem')} · barra de tema: ${count('barra de tema')} · contraste: ${count('contraste')}`,
);
console.log(`Relatório: ${join(output, 'relatorio.html')}`);
process.exit(count('erro') + count('rolagem') + count('barra de tema') > 0 ? 1 : 0);

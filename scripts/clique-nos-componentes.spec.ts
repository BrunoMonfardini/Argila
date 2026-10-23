import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from '@jest/globals';

/**
 * Um host com `pointer-events: none` deixa o clique passar para o que está embaixo (o
 * botão do calendário fica sobre o fim do campo de data). Tudo dentro dele herda o none:
 * cada botão e cada diálogo precisa devolver `pointer-events: auto`, senão não aceita
 * clique. O top layer de um `<dialog>` modal não reinicia propriedades herdadas.
 * O jsdom não calcula herança de pointer-events, por isso a regra é conferida no CSS.
 */

interface Regra {
  readonly seletor: string;
  readonly corpo: string;
}

/** As regras do nível de cima do arquivo, sem as que estão dentro de @supports, @media… */
function regrasDoTopo(css: string): Regra[] {
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const regras: Regra[] = [];
  let profundidade = 0;
  let inicio = 0;
  let seletor = '';
  for (let i = 0; i < semComentarios.length; i++) {
    const c = semComentarios[i];
    if (c === '{') {
      if (profundidade === 0) {
        seletor = semComentarios.slice(inicio, i).trim();
        inicio = i + 1;
      }
      profundidade++;
    } else if (c === '}') {
      profundidade--;
      if (profundidade === 0) {
        if (!seletor.startsWith('@'))
          regras.push({ seletor, corpo: semComentarios.slice(inicio, i) });
        inicio = i + 1;
      }
    }
  }
  return regras;
}

const liberaClique = (corpo: string) => /pointer-events:\s*auto/.test(corpo);
const bloqueiaClique = (corpo: string) => /pointer-events:\s*none/.test(corpo);

// Caminhos com "/" também no Windows, para a comparação com o caminho esperado
const BLOQUEADOS = globSync('projects/ui/src/lib/**/*.css')
  .map((arquivo) => arquivo.replaceAll('\\', '/'))
  .filter((arquivo) =>
    regrasDoTopo(readFileSync(arquivo, 'utf8')).some(
      (regra) => regra.seletor === ':host' && bloqueiaClique(regra.corpo),
    ),
  );

describe('clique dentro de host que deixa o clique passar', () => {
  it('lê só as regras do topo, sem as de @supports', () => {
    const regras = regrasDoTopo('.a { x: 1; } @supports (y: z) { .a { y: 2; } } /* .b {} */ .c {}');
    expect(regras.map((r) => r.seletor)).toEqual(['.a', '.c']);
  });

  it('o calendário do campo de data está entre os hosts conferidos', () => {
    expect(BLOQUEADOS).toContain('projects/ui/src/lib/date-picker/date-toggle.css');
  });

  it.each(BLOQUEADOS)('%s: cada botão e diálogo devolve pointer-events: auto', (arquivo) => {
    const presos = regrasDoTopo(readFileSync(arquivo, 'utf8'))
      .filter((regra) => /__(button|dialog)$/.test(regra.seletor))
      .filter((regra) => !liberaClique(regra.corpo))
      .map((regra) => regra.seletor);

    expect(presos).toEqual([]);
  });
});

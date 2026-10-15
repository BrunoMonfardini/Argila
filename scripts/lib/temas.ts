/**
 * Leitura estrutural dos arquivos de tema: o que cada CSS importa, declara e
 * usa. Serve aos testes que garantem que estilos, paletas, o `temas.css` e o
 * `ArgTheme` contam a mesma história.
 */

function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Caminhos dos `@import` de um CSS, na ordem. */
export function cssImports(css: string): string[] {
  return [...withoutComments(css).matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/g)].map(
    (match) => match[1],
  );
}

/** Propriedades customizadas declaradas (`--nome: valor`). */
export function declaredTokens(css: string): Set<string> {
  return new Set([...withoutComments(css).matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
}

/** Propriedades customizadas lidas com `var()` sem valor reserva. */
export function requiredTokens(css: string): Set<string> {
  return new Set(
    [...withoutComments(css).matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((match) => match[1]),
  );
}

/** Seletores de nível superior de um CSS, cada alternativa da vírgula separada. */
export function topLevelSelectors(css: string): string[] {
  const source = withoutComments(css);
  const selectors: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '{') {
      if (depth === 0) {
        const selector = source.slice(start, i).trim();
        if (!selector.startsWith('@')) {
          selectors.push(...selector.split(',').map((part) => part.trim()));
        }
      }
      depth++;
    } else if (source[i] === '}') {
      depth--;
      if (depth === 0) start = i + 1;
    }
  }
  return selectors;
}

/** Chaves de um objeto literal exportado em TypeScript: `export const NOME = { a: …, 'b-c': … }`. */
export function objectKeys(source: string, name: string): string[] {
  const body = new RegExp(`export const ${name}\\b[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`).exec(source);
  if (!body) throw new Error(`objeto não encontrado: ${name}`);
  return [...body[1].matchAll(/^\s*'?([\w-]+)'?\s*:/gm)].map((match) => match[1]);
}

/** Itens de um array literal de strings exportado: `export const NOME = ['a', 'b']`. */
export function arrayItems(source: string, name: string): string[] {
  const body = new RegExp(`export const ${name}\\b[^=]*=\\s*\\[([^\\]]*)\\]`).exec(source);
  if (!body) throw new Error(`array não encontrado: ${name}`);
  return [...body[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

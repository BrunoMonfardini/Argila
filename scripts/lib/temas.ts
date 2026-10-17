/**
 * Leitura estrutural dos arquivos de tema: o que cada CSS importa, declara e
 * usa. Serve aos testes que garantem que os design systems, as paletas e o
 * `temas.css` contam a mesma história.
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

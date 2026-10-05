export type CodeLanguage = 'ts' | 'html' | 'css' | 'sh';

export type TokenKind =
  'plain' | 'comment' | 'string' | 'keyword' | 'number' | 'decorator' | 'tag' | 'attr' | 'property';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

type Rule = [TokenKind | 'template', RegExp];

const TS_KEYWORDS =
  'as|async|await|class|const|else|export|extends|false|for|from|function|if|implements|import|interface|let|new|null|of|private|protected|public|readonly|return|this|true|type|undefined|void';

const TS_RULES: Rule[] = [
  ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
  ['template', /`(?:\\.|[^`\\])*`/y],
  ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y],
  ['decorator', /@[A-Za-z]\w*/y],
  ['keyword', new RegExp(`\\b(?:${TS_KEYWORDS})\\b`, 'y')],
  ['number', /\b\d+(?:\.\d+)?\b/y],
];

const HTML_RULES: Rule[] = [
  ['comment', /<!--[\s\S]*?-->/y],
  ['tag', /<\/?[A-Za-z][\w-]*|\/?>/y],
  ['attr', /[^\s"'<>/=]+(?==)/y],
  ['string', /"[^"]*"|'[^']*'/y],
];

const CSS_RULES: Rule[] = [
  ['comment', /\/\*[\s\S]*?\*\//y],
  // Propriedade seguida de ": "; sem o espaço é seletor, como a:hover
  ['property', /(?:--)?[A-Za-z][\w-]*(?=\s*:\s)/y],
  ['string', /'[^']*'|"[^"]*"/y],
  ['number', /-?\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s)?\b/y],
];

// Comandos de terminal ficam sem cor: são curtos e qualquer regra erraria mais que acertaria
const RULES: Record<CodeLanguage, Rule[]> = {
  ts: TS_RULES,
  html: HTML_RULES,
  css: CSS_RULES,
  sh: [],
};

/**
 * Quebra o código em trechos com tipo, para colorir sem biblioteca. Em
 * TypeScript, o conteúdo entre crases é tratado como HTML: é onde ficam os
 * templates dos componentes.
 */
export function highlight(code: string, language: CodeLanguage): CodeToken[] {
  const tokens: CodeToken[] = [];
  const rules = RULES[language];
  let plain = '';
  let index = 0;

  const flush = () => {
    if (plain) tokens.push({ text: plain, kind: 'plain' });
    plain = '';
  };

  outer: while (index < code.length) {
    for (const [kind, pattern] of rules) {
      pattern.lastIndex = index;
      const match = pattern.exec(code);
      if (match?.[0]) {
        flush();
        if (kind === 'template') {
          tokens.push({ text: '`', kind: 'string' });
          tokens.push(...highlight(match[0].slice(1, -1), 'html'));
          tokens.push({ text: '`', kind: 'string' });
        } else {
          tokens.push({ text: match[0], kind });
        }
        index += match[0].length;
        continue outer;
      }
    }
    plain += code[index];
    index++;
  }
  flush();
  return tokens;
}

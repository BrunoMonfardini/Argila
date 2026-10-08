/**
 * Verificações de acessibilidade próprias, usadas nos testes de componente:
 *
 * ```ts
 * expect(a11yViolations(fixture.nativeElement)).toEqual([]);
 * ```
 *
 * Cobrem as falhas mais comuns, não todas as regras do WCAG: navegação por
 * teclado e leitor de tela continuam sendo revisados à mão em todo PR.
 * Não entra no pacote publicado (o public-api.ts não exporta).
 */

export type A11yRule =
  | 'nome-acessivel'
  | 'aria-desconhecido'
  | 'aria-valor'
  | 'aria-id'
  | 'tabindex-positivo'
  | 'imagem-sem-alt'
  | 'svg-sem-nome'
  | 'foco-escondido';

export interface A11yViolation {
  rule: A11yRule;
  /** Início do HTML do elemento, para achar o problema. */
  element: string;
  message: string;
}

const ARIA_ATTRIBUTES = new Set(
  (
    'activedescendant atomic autocomplete braillelabel brailleroledescription busy checked ' +
    'colcount colindex colindextext colspan controls current describedby description details ' +
    'disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid ' +
    'keyshortcuts label labelledby level live modal multiline multiselectable orientation owns ' +
    'placeholder posinset pressed readonly relevant required roledescription rowcount rowindex ' +
    'rowindextext rowspan selected setsize sort valuemax valuemin valuenow valuetext'
  )
    .split(' ')
    .map((name) => `aria-${name}`),
);

const BOOLEAN = ['true', 'false'];
const TRISTATE = ['true', 'false', 'mixed', 'undefined'];

/** Atributos de valor enumerado e os valores aceitos. */
const ARIA_VALUES: Record<string, string[]> = {
  'aria-atomic': BOOLEAN,
  'aria-busy': BOOLEAN,
  'aria-disabled': BOOLEAN,
  'aria-modal': BOOLEAN,
  'aria-multiline': BOOLEAN,
  'aria-multiselectable': BOOLEAN,
  'aria-readonly': BOOLEAN,
  'aria-required': BOOLEAN,
  'aria-hidden': [...BOOLEAN, 'undefined'],
  'aria-expanded': [...BOOLEAN, 'undefined'],
  'aria-selected': [...BOOLEAN, 'undefined'],
  'aria-checked': TRISTATE,
  'aria-pressed': TRISTATE,
  'aria-current': ['page', 'step', 'location', 'date', 'time', ...BOOLEAN],
  'aria-live': ['off', 'polite', 'assertive'],
  'aria-invalid': ['grammar', 'spelling', ...BOOLEAN],
  'aria-haspopup': ['menu', 'listbox', 'tree', 'grid', 'dialog', ...BOOLEAN],
  'aria-orientation': ['horizontal', 'vertical', 'undefined'],
  'aria-sort': ['ascending', 'descending', 'none', 'other'],
  'aria-autocomplete': ['inline', 'list', 'both', 'none'],
};

/** Atributos que apontam para ids de outros elementos. */
const ARIA_ID_REFERENCES = [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
];

/** Papéis cujo nome pode vir do texto de dentro do elemento. */
const NAME_FROM_CONTENT = new Set([
  'button',
  'link',
  'checkbox',
  'radio',
  'switch',
  'tab',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'treeitem',
]);

/** Papéis que sempre precisam de nome acessível. */
const NEEDS_NAME = new Set([
  ...NAME_FROM_CONTENT,
  'combobox',
  'img',
  'progressbar',
  'searchbox',
  'slider',
  'spinbutton',
  'textbox',
  'meter',
  'dialog',
  'alertdialog',
]);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const IMPLICIT_ROLES: Record<string, (element: Element) => string | undefined> = {
  a: (element) => (element.hasAttribute('href') ? 'link' : undefined),
  button: () => 'button',
  summary: () => 'button',
  select: () => 'combobox',
  textarea: () => 'textbox',
  progress: () => 'progressbar',
  meter: () => 'meter',
  dialog: () => 'dialog',
  input: (element) => {
    const type = (element.getAttribute('type') ?? 'text').toLowerCase();
    const roles: Record<string, string | undefined> = {
      hidden: undefined,
      checkbox: 'checkbox',
      radio: 'radio',
      range: 'slider',
      number: 'spinbutton',
      search: 'searchbox',
      button: 'button',
      submit: 'button',
      reset: 'button',
      image: 'button',
    };
    return type in roles ? roles[type] : 'textbox';
  },
};

function roleOf(element: Element): string | undefined {
  const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0];
  if (explicit) return explicit;
  return IMPLICIT_ROLES[element.localName]?.(element);
}

function describe(element: Element): string {
  const html = element.outerHTML.replace(/\s+/g, ' ');
  return html.length > 80 ? `${html.slice(0, 80)}…` : html;
}

function isHidden(element: Element): boolean {
  return !!element.closest('[aria-hidden="true"], [hidden]');
}

/** Texto como o leitor de tela lê: sem partes ocultas, com alt e aria-label dos filhos. */
function textOf(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (!(node instanceof Element)) return '';
  if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden')) return '';
  const label = node.getAttribute('aria-label')?.trim();
  if (label) return label;
  if (node.localName === 'img') return node.getAttribute('alt') ?? '';
  return Array.from(node.childNodes, textOf).join(' ');
}

function labelsOf(element: Element): string {
  const labels = (element as HTMLInputElement).labels;
  return labels ? Array.from(labels, (label) => textOf(label)).join(' ') : '';
}

/** Nome acessível simplificado, na ordem de precedência da especificação. */
export function accessibleName(element: Element): string {
  const document = element.ownerDocument;
  const labelledby = element.getAttribute('aria-labelledby');
  if (labelledby) {
    const text = labelledby
      .split(/\s+/)
      .map((id) => {
        const target = document.getElementById(id);
        return target ? textOf(target) : '';
      })
      .join(' ');
    if (text.trim()) return text.replace(/\s+/g, ' ').trim();
  }
  const label = element.getAttribute('aria-label')?.trim();
  if (label) return label;

  const fromLabels = labelsOf(element).trim();
  if (fromLabels) return fromLabels.replace(/\s+/g, ' ');

  if (element.localName === 'img') return element.getAttribute('alt')?.trim() ?? '';
  const role = roleOf(element);
  if (role && NAME_FROM_CONTENT.has(role)) {
    const text = Array.from(element.childNodes, textOf).join(' ').replace(/\s+/g, ' ').trim();
    if (text) return text;
  }
  const value = element.localName === 'input' ? element.getAttribute('value')?.trim() : undefined;
  if (value && ['button', 'submit', 'reset'].includes(element.getAttribute('type') ?? '')) {
    return value;
  }
  return element.getAttribute('title')?.trim() ?? '';
}

function checkName(element: Element, violations: A11yViolation[]): void {
  const role = roleOf(element);
  if (!role || !NEEDS_NAME.has(role) || isHidden(element)) return;
  if (!accessibleName(element)) {
    violations.push({
      rule: 'nome-acessivel',
      element: describe(element),
      message: `${role} sem nome acessível: use texto, aria-label ou aria-labelledby`,
    });
  }
}

function checkAria(element: Element, violations: A11yViolation[]): void {
  const document = element.ownerDocument;
  for (const { name, value } of Array.from(element.attributes)) {
    if (!name.startsWith('aria-')) continue;
    if (!ARIA_ATTRIBUTES.has(name)) {
      violations.push({
        rule: 'aria-desconhecido',
        element: describe(element),
        message: `${name} não existe no ARIA`,
      });
      continue;
    }
    const allowed = ARIA_VALUES[name];
    if (allowed && !allowed.includes(value.trim())) {
      violations.push({
        rule: 'aria-valor',
        element: describe(element),
        message: `${name}="${value}" inválido: use ${allowed.join(', ')}`,
      });
    }
    if (ARIA_ID_REFERENCES.includes(name)) {
      for (const id of value.split(/\s+/).filter(Boolean)) {
        if (!document.getElementById(id)) {
          violations.push({
            rule: 'aria-id',
            element: describe(element),
            message: `${name} aponta para o id "${id}", que não existe na página`,
          });
        }
      }
    }
  }
}

function checkTabindex(element: Element, violations: A11yViolation[]): void {
  const tabindex = Number(element.getAttribute('tabindex'));
  if (tabindex > 0) {
    violations.push({
      rule: 'tabindex-positivo',
      element: describe(element),
      message: `tabindex="${tabindex}" muda a ordem natural do foco: use 0 ou -1`,
    });
  }
}

function checkImage(element: Element, violations: A11yViolation[]): void {
  if (element.localName === 'img' && !element.hasAttribute('alt') && !isHidden(element)) {
    violations.push({
      rule: 'imagem-sem-alt',
      element: describe(element),
      message: 'imagem sem alt: descreva a imagem, ou use alt="" se for decorativa',
    });
  }
  const insideSvg = element.parentElement?.closest('svg');
  if (element.localName === 'svg' && !insideSvg && !isHidden(element)) {
    if (roleOf(element) !== 'img' || !accessibleName(element)) {
      violations.push({
        rule: 'svg-sem-nome',
        element: describe(element),
        message: 'svg sem aria-hidden="true" nem role="img" com nome acessível',
      });
    }
  }
}

function checkHiddenFocus(element: Element, violations: A11yViolation[]): void {
  if (element.getAttribute('aria-hidden') !== 'true') return;
  const focusable = element.matches(FOCUSABLE) ? element : element.querySelector(FOCUSABLE);
  if (focusable) {
    violations.push({
      rule: 'foco-escondido',
      element: describe(focusable),
      message:
        'elemento focável dentro de aria-hidden="true": o teclado chega onde o leitor não lê',
    });
  }
}

/** Verifica o elemento e tudo dentro dele. Lista vazia: nenhuma violação encontrada. */
export function a11yViolations(root: Element): A11yViolation[] {
  const violations: A11yViolation[] = [];
  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    checkName(element, violations);
    checkAria(element, violations);
    checkTabindex(element, violations);
    checkImage(element, violations);
    checkHiddenFocus(element, violations);
  }
  return violations;
}

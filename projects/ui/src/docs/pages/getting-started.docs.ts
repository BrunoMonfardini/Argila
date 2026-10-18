import { DocPage } from '../doc-page';

export const GETTING_STARTED_DOCS: DocPage = {
  slug: 'como-comecar',
  title: 'Como começar',
  category: 'Guias',
  summary:
    'Do projeto vazio ao primeiro componente: instalar, incluir os tokens, escolher o design system com um segmento e usar o primeiro componente.',
  examples: [],
  content: [
    {
      heading: '1. Instalar',
      body: [
        'O pacote é privado, no GitHub Packages: crie um `.npmrc` com `@brunomonfardini:registry=https://npm.pkg.github.com` e um token com `read:packages` em `NODE_AUTH_TOKEN`.',
      ],
      code: {
        language: 'sh',
        label: 'Comando de instalação',
        code: 'pnpm add @brunomonfardini/ui',
      },
    },
    {
      heading: '2. Incluir os tokens',
      body: [
        'Uma vez, no `angular.json`. O `argila.css` traz o design system padrão; o `temas.css`, os outros design systems, as paletas e as cores de marca. O `base.css` é opcional (fonte, cores e foco do documento).',
      ],
      code: {
        language: 'ts',
        label: 'styles do angular.json',
        code: `"styles": [
  "node_modules/@brunomonfardini/ui/tokens/argila.css",
  "node_modules/@brunomonfardini/ui/tokens/base.css",
  "node_modules/@brunomonfardini/ui/tokens/temas.css",
  "src/styles.css"
]`,
      },
    },
    {
      heading: '3. Escolher o design system com um segmento',
      body: [
        'Um segmento junta design system, paleta, cores, modo e transparência com um nome. O TypeScript só aceita paletas que o design system aceita. Sem segmento, vale o Argila com a paleta nativa.',
      ],
      code: {
        language: 'ts',
        label: 'app.config.ts',
        code: `import { provideArgila } from '@brunomonfardini/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideArgila({
      segments: {
        essencial: { style: 'argila' },
        premium: { style: 'argila', palette: 'terrosa', scheme: 'dark', colors: { primary: 'cobre' } },
      },
      defaultSegment: 'essencial',
    }),
  ],
};`,
      },
    },
    {
      heading: '4. O primeiro componente',
      body: [
        'Importe o componente no `imports` e use o seletor. Cada página do catálogo tem o código dos exemplos para copiar; a aba Código lista as propriedades.',
      ],
      code: {
        language: 'ts',
        label: 'Primeiro componente',
        code: `import { ArgButton } from '@brunomonfardini/ui';

@Component({
  imports: [ArgButton],
  template: \`<button arg-button variant="primary" (click)="salvar()">Salvar</button>\`,
})
export class Exemplo {}`,
      },
    },
    {
      heading: 'Trocar o segmento em tempo de execução',
      body: [
        "Com `inject(ArgTheme).setSegment('premium')`, por exemplo depois do login. Sem Angular (HTML estático, servidor), `argSegmentAttributes` devolve os atributos do `<html>`.",
      ],
    },
  ],
};

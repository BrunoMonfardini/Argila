import { DocPage } from '../../docs/doc-page';
import { ProgressBarIndeterminateExample } from './examples/progress-bar-indeterminate.example';
import { ProgressBarUploadExample } from './examples/progress-bar-upload.example';
import { ArgProgressBar } from './progress-bar';

export const PROGRESS_BAR_DOCS: DocPage = {
  slug: 'progress-bar',
  title: 'Progress Bar',
  category: 'Componentes',
  group: 'Feedback',
  summary:
    'Mostra o andamento de uma tarefa longa: envio de arquivos, importação, geração de relatório. Com `value`, mostra quanto falta; sem `value`, só que está em andamento. Para esperas curtas, use o Spinner.',
  component: ArgProgressBar,
  hostElement: 'progress',
  playgroundInputs: { label: 'Enviando fotos', value: 40 },
  examples: [
    { name: 'Determinada', component: ProgressBarUploadExample },
    { name: 'Indeterminada', component: ProgressBarIndeterminateExample },
  ],
  guidelines: {
    do: [
      'Use a determinada sempre que souber o total: ela diz quanto falta.',
      'Escreva o que está acontecendo ao lado da barra e repita esse texto no `label`.',
      'Use `valueText` quando a unidade importa: "3 de 5 fotos" diz mais que "60%".',
    ],
    dont: [
      'Não use para esperas de menos de alguns segundos: aí o Spinner basta.',
      'Não deixe a barra voltar para trás; se a tarefa recomeçar, diga isso em texto.',
    ],
  },
  accessibility: [
    'É um `<progress>` nativo, com o papel `progressbar`: o leitor de tela lê o nome e a porcentagem.',
    'O `label` é obrigatório: sem ele o template não compila.',
    'O preenchimento contra o trilho passa no contraste de elementos gráficos (3:1). Em alto contraste, a barra ganha borda e usa as cores do sistema.',
    'Com `prefers-reduced-motion`, a animação da indeterminada fica três vezes mais lenta, sem parar.',
  ],
};

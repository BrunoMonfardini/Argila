import { DocPage } from '../../docs/doc-page';
import { FileUploadPetExample } from './examples/file-upload-pet.example';
import { ArgFileUpload } from './file-upload';

export const FILE_UPLOAD_DOCS: DocPage = {
  slug: 'file-upload',
  title: 'File Upload',
  category: 'Componentes',
  group: 'Formulário',
  summary:
    'Campo de arquivos com área para arrastar e soltar, prévia de imagens, validação de tipo e tamanho e progresso de envio. O envio em si (ex.: Supabase Storage) vem de um `uploader` passado por quem usa.',
  component: ArgFileUpload,
  // A área de soltar precisa de um uploader e de arquivos: o exemplo mostra o componente
  playground: false,
  examples: [{ name: 'Fotos e exames', component: FileUploadPetExample }],
  guidelines: {
    do: [
      'Diga na dica os tipos e o tamanho aceitos: "Imagens ou PDF, até 5 MB cada".',
      'Use `accept` e `maxSize`: o arquivo recusado aparece na lista com o motivo, em vez de sumir.',
      'No `uploader`, chame `onProgress` com o percentual e rejeite a promessa em caso de erro.',
      'Valide também no servidor: o `accept` do navegador é só uma ajuda.',
    ],
    dont: [
      'Não esconda o botão de escolher: arrastar não funciona no teclado nem em muitos celulares.',
      'Não envie o formulário enquanto houver arquivos enviando.',
    ],
  },
  accessibility: [
    'É um `<input type="file">` nativo: Tab chega à área e Enter ou Espaço abrem o seletor do sistema. O nome é o título da área e a dica é a descrição.',
    'Arrastar e soltar é um atalho: tudo também funciona sem o mouse.',
    'O leitor de tela anuncia o que entrou, o que foi recusado e por quê, o que foi enviado e o que foi removido. Cada arquivo é lido com o estado: "thor.jpg, 1 KB".',
    'Cada envio tem uma barra de progresso com nome ("Enviando thor.jpg"). Ao remover um arquivo, o foco volta para o campo.',
    'A prévia é decorativa (`alt=""`): o nome do arquivo já está escrito.',
  ],
};

import { DocPage } from '../../docs/doc-page';
import { ArgDateInput } from './date-input';
import { DatePickerBookingExample } from './examples/date-picker-booking.example';

export const DATE_PICKER_DOCS: DocPage = {
  slug: 'date-picker',
  title: 'Date Picker',
  category: 'Componentes',
  group: 'Formulário',
  summary:
    'Campo de data: digitação direta em "dd/mm/aaaa" ou escolha num calendário navegável por teclado, com limites e dias bloqueados. O formulário recebe a data em ISO (`2026-10-13`).',
  component: ArgDateInput,
  // Como Input e Select: um campo solto, sem arg-field, não tem rótulo
  playground: false,
  examples: [{ name: 'Agendamento', component: DatePickerBookingExample }],
  guidelines: {
    do: [
      'Guarde e envie a data em ISO; mostre com `formatBr`.',
      'Bloqueie com `blocked` os dias sem atendimento (domingos, feriados) e limite com `min` e `max`.',
      'Explique a regra na dica do campo ("De segunda a sábado") e o motivo no erro.',
      'Com a data incompleta ou inexistente, o valor é `null`: mostre `incomplete` e `date` antes de `required`, que aparece junto.',
    ],
    dont: [
      'Não obrigue a pessoa a usar o calendário: digitar é mais rápido para datas conhecidas, como a de nascimento.',
      'Não use para escolher horário: isso é o Time Slot Picker.',
    ],
  },
  accessibility: [
    'O campo é um `<input>` nativo com o formato no `placeholder`; dentro do `arg-field`, tem rótulo, dica e erro. As barras entram sozinhas enquanto se digita.',
    'O botão do calendário diz a data atual: "Mudar a data, terça-feira, 13 de outubro de 2026".',
    'O calendário é um `<dialog>` modal com uma grade (`role="grid"`) nomeada pelo mês, que é anunciado ao mudar. Cada dia é lido por extenso.',
    'Teclado: setas mudam dia e semana, Home e End vão ao início e ao fim da semana, PageUp e PageDown mudam o mês (com Shift, o ano), Enter ou Espaço escolhem, Esc fecha. Ao fechar, o foco volta ao botão.',
    'Escolhida, hoje e bloqueada não dependem só da cor: a escolhida é preenchida (`aria-selected`), hoje tem contorno (`aria-current="date"`), a bloqueada é riscada (`aria-disabled`).',
  ],
};

---
'@brunomonfardini/ui': minor
---

Serviço `ArgToast`: avisos curtos no canto da tela com `show(mensagem, { title, tone, duration, action })`, que devolve um `ArgToastRef` com o motivo do fechamento. Fila com até 3 avisos visíveis, tempo pausado com o mouse em cima ou o foco dentro, anúncio pelo leitor de tela (educado ou interrompendo, pelo tom) e pilha na camada de topo (`popover="manual"`).

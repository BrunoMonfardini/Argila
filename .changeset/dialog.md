---
'@brunomonfardini/ui': minor
---

Serviço `ArgDialog` sobre o `<dialog>` nativo: `open(Componente, { data, size, label, dismissable })` devolve um `ArgDialogRef` com o resultado em `closed`, e `confirm({ title, message, confirmText, tone })` é a confirmação pronta (`role="alertdialog"`). Foco preso pelo `showModal()`, Esc e clique fora fecham, e o foco volta a quem abriu. Diretivas `argDialogTitle` e `argDialogDescription`; áreas `arg-dialog-content` e `arg-dialog-actions`.

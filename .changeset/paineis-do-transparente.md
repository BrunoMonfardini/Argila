---
'@brunomonfardini/ui': patch
---

Painéis sobre o conteúdo (Dialog, Popover, Menu, Combobox, calendário do Date Picker, Toast e "pular para o conteúdo") ficam no mínimo 80% opacos e desfocam o que está atrás. Com a transparência baixa (Transparente a 60%, ou qualquer estilo abaixo de 80%), o texto de trás não aparece mais através deles. O novo token `--arg-surface-raised-alpha` controla essa opacidade.

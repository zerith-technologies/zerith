---
name: "Pull Request"
about: "Modelo para Pull Requests do ZERITH"
title: "[PR] <Descreva a mudança>"
labels: ["review"]
body:
  - type: textarea
    id: contexto
    attributes:
      label: Contexto
      description: Explique o contexto e objetivo do PR.
      placeholder: Exemplo: Adiciona autenticação JWT ao backend.
    validations:
      required: true
  - type: textarea
    id: implementacao
    attributes:
      label: O que foi implementado?
      description: Liste as principais mudanças deste PR.
      placeholder: Exemplo: - Novo endpoint /auth/login\n- Testes unitários\n- Atualização da documentação
    validations:
      required: true
  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      description: Marque o que foi feito.
      options:
        - label: Código revisado
        - label: Testes realizados
        - label: Documentação atualizada
        - label: Não quebrou nada existente
  - type: textarea
    id: observacoes
    attributes:
      label: Observações
      description: Alguma observação extra?
      placeholder: Exemplo: Depende do PR #X.
    validations:
      required: false

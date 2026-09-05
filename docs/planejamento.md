# Planejamento do Projeto — my-story-maker

**Versão:** 0.1.0  
**Data:** 2026-08-29  
**Autor:** Karlo  

---

## 1. Objetivo

Transformar o protótipo funcional existente em um MVP estável, seguro e preparado para evolução contínua, seguindo os gates definidos no PRD e as decisões arquiteturais do ADR.

---

## 2. Fonte de Inspiração

- Protótipo funcional: `.inspo/mvp-funcional.html`
- Estrutura de layout: 3 colunas (sidebar, canvas, ferramentas)
- Padrão visual: Wanderlab-like, minimalista, com sombras suaves e cantos arredondados

---

## 3. Estrutura de Trabalho por Gates

O desenvolvimento seguirá rigorosamente os gates do PRD. Cada gate deve ser concluído e validado antes do próximo.

### Gate 1 — Visual + Fundamentos
**Duração:** 1 semana  
**Status:** Em andamento  

**Objetivo:** Ter a estrutura visual e os fundamentos da aplicação funcionando.

**Critérios de Aceitação:**
- [x] Layout de 3 colunas responsivo (sidebar, canvas, ferramentas) — inspirado em `.inspo/mvp-funcional.html`
- [x] Design system aplicado (cores, tipografia, espaçamento, sombras, cantos arredondados)
- [x] Navegação funcional com estados ativos
- [x] Canvas Story (9:16) com imagem de fundo padrão
- [x] Topbar com ações (Limpar, Salvar, Pré-visualizar, Exportar)
- [x] Componentes base estilizados (botões, chips, sliders, cards de filtro)
- [x] Responsividade básica validada em desktop

**Entregáveis:**
- Estrutura HTML/CSS/JS do MVP
- Documento de design system
- Telas: sidebar, canvas, painel de ferramentas

**ADRs Relevantes:**
- ADR-001 — Stack vanilla
- ADR-002 — Sem login
- ADR-004 — Layout 3 colunas
- ADR-009 — Design system próprio
- ADR-010 — Acessibilidade
- ADR-012 — Limite 10 MB

---

### Gate 2 — Colagem + Upload de Imagens
**Duração:** 1 semana  
**Status:** Planejado  

**Objetivo:** Permitir que o usuário trabalhe com múltiplas fotos e templates de colagem.

**Critérios de Aceitação:**
- [ ] Templates de colagem aplicáveis (vazio, grid3, mosaic)
- [ ] Overlay de grade visual no canvas
- [ ] Upload de fotos via botão e drag-and-drop
- [ ] Feed de fotos recentes arrastáveis para o canvas
- [ ] Troca de imagem de fundo ao soltar foto no canvas
- [ ] Preview das fotos no feed com thumbnails
- [ ] Validação de 10 MB por imagem antes do processamento

**Entregáveis:**
- Templates de colagem funcionais
- Sistema de drag-and-drop de fotos
- Feed de fotos recentes

**ADRs Relevantes:**
- ADR-005 — Drag-and-drop HTML5 + Pointer Events
- ADR-012 — Limite 10 MB por imagem
- ADR-006 — Estado em memória

---

### Gate 3 — Filtros e Ajustes
**Duração:** 3 dias  
**Status:** Planejado  

**Objetivo:** Permitir edição visual básica da imagem de fundo.

**Critérios de Aceitação:**
- [ ] Filtros preset aplicáveis (Original, Clarea, Avellã, Pôr do sol)
- [ ] Sliders de brilho, saturação e zoom funcionais
- [ ] Aplicação em tempo real sem recarregar a página
- [ ] Preview dos filtros nos cards da direita
- [ ] Reset de ajustes

**Entregáveis:**
- Sistema de filtros CSS
- Sliders de ajustes integrados
- Reset de edição

**ADRs Relevantes:**
- ADR-003 — CSS Filters + Transforms
- ADR-011 — CSS Transitions para filtros

---

### Gate 4 — Texto e Elementos
**Duração:** 3 dias  
**Status:** Planejado  

**Objetivo:** Permitir adicionar e estilizar textos e elementos decorativos.

**Critérios de Aceitação:**
- [ ] Adicionar texto com posicionamento livre
- [ ] Adicionar sticker, forma e linha
- [ ] Estilo de texto: cor, tamanho, fonte
- [ ] Seleção de elemento com destaque visual
- [ ] Arrastar elementos pelo canvas
- [ ] Remover elemento (click + delete/backspace)

**Entregáveis:**
- Quick-add de elementos
- Painel de estilo de texto
- Sistema de seleção e arraste

**ADRs Relevantes:**
- ADR-005 — Drag-and-drop HTML5 + Pointer Events
- ADR-006 — Estado em memória

---

### Gate 5 — Exportação e Polimento
**Duração:** 3 dias  
**Status:** Planejado  

**Objetivo:** Preparar o produto para uso real.

**Critérios de Aceitação:**
- [ ] Exportação real em PNG/JPG/WebP (html2canvas ou canvas API)
- [ ] Modal de pré-visualização em tela cheia
- [ ] Feedback visual em todos os botões
- [ ] Tratamento de erros (upload inválido, etc.)
- [ ] Performance audit (Lighthouse) > 80

**Entregáveis:**
- Função de exportação funcional
- Modal de preview
- Relatório de performance

**ADRs Relevantes:**
- ADR-008 — Exportação: Placeholder para html2canvas / Canvas API
- ADR-011 — CSS Transitions para filtros

---

## 4. Visão Geral da Aplicação

Baseado no PRD, ADR e inspiração `.inspo/mvp-funcional.html`:

### 4.1 Layout Principal
- **Sidebar esquerda:** navegação (Templates, Mídia, Elementos, Texto, Música, Feed, Ajustes)
- **Centro:** canvas em formato Story (9:16), com fundo editável
- **Direita:** ferramentas contextuais (filtros, ajustes, upload, fotos recentes, quick-add)

### 4.2 Fluxo Principal
1. Usuário abre a página
2. Vê o canvas com imagem padrão
3. Pode arrastar fotos do feed para o canvas ou fazer upload
4. Aplica filtros e ajustes
5. Adiciona textos/elementos
6. Exporta ou salva (simulação)

### 4.3 Stack Tecnológica
- **Frontend:** HTML + CSS + JavaScript vanilla
- **CSS:** CSS Variables, CSS Grid, Flexbox, CSS Filters
- **JavaScript:** Vanilla JS com modularidade por arquivos
- **Exportação:** html2canvas ou Canvas API
- **Build:** Sem build step no MVP

---

## 5. Estrutura de Diretórios

```
my-story-maker/
├── index.html
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   └── utils.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── filters.js
│   ├── drag-drop.js
│   ├── elements.js
│   ├── export.js
│   └── utils.js
├── assets/
│   └── icons/
├── docs/
│   ├── planejamento.md
│   └── coding-guidelines.md
├── PRD.md
├── ADR.md
├── security-redteam.md
└── best-in-class.md
```

---

## 6. Dependências Externas

**Permitidas:**
- html2canvas (para exportação) — via CDN, apenas se necessário

**Proibidas:**
- Frameworks CSS (Bootstrap, Tailwind)
- Frameworks JS (React, Vue, jQuery)
- Bibliotecas de drag-and-drop externas

**Justificativa:** Seguir ADR-001 (stack vanilla) e ADR-009 (design system próprio).

---

## 7. Critérios de "Pronto" (Definition of Done)

Um gate está pronto quando:
1. Todos os critérios de aceitação estão marcados
2. Código revisado e sem erros de console
3. Testado manualmente nos browsers alvo (Chrome, Edge, Safari)
4. Documentação atualizada (se necessário)
5. Aplicação não apresenta regressões nos gates anteriores

---

## 8. Riscos e Mitigações

| Risco | Mitigação |
|--------|-----------|
| HTML5 DnD inconsistente em mobile | Usar fallback com Pointer Events; validar em testes |
| Performance com muitas imagens | Limite de 10 MB, lazy loading, otimização de filtros |
| Exportação com CSS moderno | Avaliar html2canvas vs Canvas API no Gate 5 |
| Complexidade crescente | Modularização por arquivos, seguir coding guidelines |
| Falhas de segurança | Seguir security-redteam.md, sanitização de inputs |

---

## 9. Próximos Passos

1. Revisar e aprovar este planejamento
2. Iniciar Gate 1 — implementar estrutura base e design system
3. Configurar ambiente de desenvolvimento local
4. Criar primeiro commit com estrutura inicial

---

## 10. Referências

- PRD: `PRD.md`
- ADRs: `ADR.md`
- Security: `security-redteam.md`
- Inspiração: `.inspo/mvp-funcional.html`
- Benchmark: `best-in-class.md`

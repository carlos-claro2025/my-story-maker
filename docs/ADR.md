# Architecture Decision Records (ADR) — my-story-maker

**Projeto:** my-story-maker  
**Versão:** 0.1.0 (MVP)  
**Data:** 2026-08-29  
**Autor:** Karlo  

---

## Formato dos ADRs

Cada ADR segue o template:
- **Título:** decisão tomada.
- **Status:** Aceito, Rejeitado, Substituído, etc.
- **Contexto:** problema e restrições.
- **Decisão:** alternativa escolhida.
- **Consequências:** impactos positivos e negativos.
- **Relacionado:** gates ou docs ligados.

---

## ADR-001 — Stack Tecnológica: HTML/CSS/JS Vanilla para MVP

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
Precisamos de um MVP rápido, sem build step, que rode no browser imediatamente. O objetivo é prototipar, validar UI/UX e chegar a um produto utilizável sem infraestrutura complexa.

### Decisão
Usar **HTML + CSS + JavaScript vanilla** (sem framework, sem bundler) para a versão inicial. Futuramente, podemos migrar para Next.js ou similar.

### Consequências
**Positivo:**
- Zero setup: abre no browser e funciona.
- Iteração rápida de UI.
- Custo baixo de manutenção no curto prazo.

**Negativo:**
- Escalabilidade limitada se o produto crescer.
- Falta de componentização formal (podemos criar convenções).
- Estado e lógica podem ficar espalhados se não houver disciplina.

---

## ADR-002 — Autenticação e Contas: Sem login no MVP

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
O produto deve funcionar de forma simples e privada. Para reduzir complexidade, custo e superfície de ataque, optamos por não implementar sistema de contas.

### Decisão
**Não existirá login** no MVP. Toda a edição ocorre localmente no browser, sem identificação de usuário.

### Consequências
**Positivo:**
- Maior privacidade: sem coleta de dados pessoais.
- Menor superfície de ataque (sem senhas, tokens, sessões).
- Fluxo mais simples para o usuário.

**Negativo:**
- Sem sincronização entre dispositivos.
- Sem projetos salvos na nuvem.
- Limitações para funcionalidades futuras que exijam identificação.

---

## ADR-003 — Sistema de Filtros: CSS Filters + Transforms

**Status:** Aceito  
**Relacionado:** Gate 1, Gate 3

### Contexto
Precisamos aplicar filtros e ajustes (brilho, saturação, zoom) em tempo real na imagem de fundo. A solução deve ser performática e simples.

### Decisão
Usar **CSS `filter` e `transform`** aplicados diretamente na `<img>` de fundo. Os sliders atualizam as propriedades via JavaScript.

### Consequências
**Positivo:**
- Performance excelente (GPU acelerado).
- Código simples sem bibliotecas extras.
- Fácil de experimentar presets.

**Negativo:**
- Filtros limitados ao suporte do browser.
- Exportação real exigirá redesenhar no canvas (não basta screenshot do DOM).

---

## ADR-004 — Layout: CSS Grid de 3 Colunas

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
O editor precisa de 3 regiões: navegação lateral, canvas central e ferramentas à direita. O layout deve ocupar a tela toda e ser estável.

### Decisão
Usar **CSS Grid** com `grid-template-columns: 220px 1fr 300px` e `height: 100vh`. O canvas central usa flexbox para centralizar o phone.

### Consequências
**Positivo:**
- Layout previsível e fácil de ajustar.
- Boa experiência desktop-first.
- Responsividade controlada via media queries.

**Negativo:**
- Em telas pequenas pode exigir reordenação futura.
- Largura fixa das laterais pode causar overflow em resoluções baixas.

---

## ADR-005 — Drag-and-Drop: HTML5 API + Pointer Events

**Status:** Aceito  
**Relacionado:** Gate 2 — Colagem + Upload de Imagens

### Contexto
Precisamos suportar dois tipos de interação:
1. Arrastar fotos do feed para o canvas (drag and drop de elementos externos).
2. Arrastar elementos dentro do canvas (texto, sticker, forma, linha).

### Decisão
- **HTML5 Drag and Drop API** para arrastar fotos do feed para o canvas.
- **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`) para arrastar elementos dentro do canvas.

### Consequências
**Positivo:**
- Suporte nativo a drag and drop entre elementos.
- Pointer Events funcionam em mouse e touch.
- Sem dependências externas.

**Negativo:**
- HTML5 DnD pode ser inconsistente entre browsers (especialmente mobile).
- Pointer Events exigem cálculo manual de posições.

---

## ADR-006 — Estado da Aplicação: Memória Local (sem persistência no MVP)

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
No MVP, não precisamos de persistência ou backend. O usuário edita, exporta e fecha. Queremos simplicidade.

### Decisão
Manter todo o estado da aplicação em **variáveis JavaScript em memória**. Filtros, elementos e fotos são perdidos ao recarregar.

### Consequências
**Positivo:**
- Simplicidade extrema.
- Sem necessidade de API ou banco de dados.
- Baixa latência.

**Negativo:**
- Sem salvamento automático.
- Perda de trabalho ao fechar o browser.
- Dificulta testes de fluxos longos.

---

## ADR-007 — Proporção Padrão: Story (9:16)

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
O produto é focado em stories do Instagram. A proporção 9:16 é a padrão.

### Decisão
Usar **9:16 como proporção padrão** do canvas (`aspect-ratio: 9/16`). Futuramente, adicionar toggle para Post (1:1) e Reels (9:16).

### Consequências
**Positivo:**
- Alinhado com o caso de uso principal.
- Layout consistente.

**Negativo:**
- Usuários que querem posts quadrados terão que esperar.
- Responsividade para outras proporções exigirá refatoração.

---

## ADR-008 — Exportação: html2canvas no frontend

**Status:** Aceito  
**Relacionado:** Gate 5 — Exportação e Polimento

### Contexto
Precisamos exportar o canvas como imagem (PNG/JPG/WebP). No MVP, queremos uma solução que não dependa de backend.

### Decisão
Usar **html2canvas** ou **Canvas API** no frontend para capturar o canvas e gerar um blob para download. Inicialmente, apenas placeholders/alerts.

### Consequências
**Positivo:**
- Exportação 100% client-side.
- Sem custo de backend.

**Negativo:**
- html2canvas pode ter limitações com CSS moderno (backdrop-filter, etc.).
- Canvas API exige reimplementar a cena manualmente.

---

## ADR-009 — Design System: Estilos Próprios (sem framework CSS)

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
Queremos controle total sobre o visual, sem dependência de bibliotecas externas como Bootstrap ou Tailwind.

### Decisão
Criar um **design system próprio** com CSS variables, utilitários mínimos e componentes estilizados manualmente.

### Consequências
**Positivo:**
- Controle total do visual.
- Sem dependências externas.
- Leveza.

**Negativo:**
- Mais trabalho inicial para criar componentes base.
- Risco de inconsistência se não houver documentação.

---

## ADR-010 — Acessibilidade: Contraste e Tamanhos Mínimos

**Status:** Aceito  
**Relacionado:** Gate 1 — Visual + Fundamentos

### Contexto
Queremos que o produto seja utilizável por pessoas com deficiência visual, mesmo no MVP.

### Decisão
Garantir **contraste mínimo de 4.5:1** (WCAG AA) e **botões com área mínima de 44x44px**. Textos essenciais não devem ser apenas em cores (usar ícones ou labels).

### Consequências
**Positivo:**
- Produto mais inclusivo.
- Facilita conformidade futura.

**Negativo:**
- Algumas escolhas de design podem ser limitadas.

---

## ADR-011 — Performance: CSS Transitions para Filtros

**Status:** Aceito  
**Relacionado:** Gate 3 — Filtros e Ajustes

### Contexto
A aplicação de filtros deve parecer fluida. Queremos animações suaves ao trocar presets ou ajustar sliders.

### Decisão
Usar **CSS `transition`** nas propriedades `filter` e `transform` da imagem de fundo.

### Consequências
**Positivo:**
- UX mais agradável.
- Código simples.

**Negativo:**
- Transições muito longas podem parecer lentas.
- Em dispositivos lentos, pode causar lag.

---

## ADR-012 — Upload: Limite de 10 MB por imagem

**Status:** Aceito  
**Relacionado:** Gate 2 — Colagem + Upload de Imagens

### Contexto
Precisamos evitar consumo excessivo de memória e reduzir riscos de abuso local ou processamento pesado no browser.

### Decisão
Impor limite de **10 MB por arquivo de imagem**, validado no cliente antes do processamento e preview.

### Consequências
**Positivo:**
- Performance mais previsível.
- Reduz risco de travamento do browser.
- Limita superfície de ataque local (arquivos enormes).

**Negativo:**
- Usuários com imagens maiores terão que redimensionar antes.
- Requer mensagem de erro clara quando o limite for ultrapassado.

---

## Histórico de Alterações

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-08-29 | 0.1.0 | Revisão após red team: adicionados ADR-002 (sem login) e ADR-012 (limite 10 MB por imagem). |

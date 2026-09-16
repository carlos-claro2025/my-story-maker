# Product Requirements Document (PRD) — my-story-maker

**Produto:** my-story-maker  
**Versão:** 0.1.0 (MVP)  
**Data:** 2026-08-29  
**Autor:** Karlo  
**Status:** Em desenvolvimento  

---

## 1. Visão do Produto

O **my-story-maker** é um editor de stories e collages para Instagram que roda diretamente no navegador. O usuário monta stories a partir de fotos, aplica filtros, adiciona textos e elementos visuais, e exporta o resultado em formato vertical (9:16) ou quadrado (1:1), pronto para publicação.

### 1.1 Objetivos do Produto
- Permitir criação rápida de stories diretamente no browser, sem instalação.
- Oferecer templates de colagem pré-prontos e um preview próximo do feed real.
- Fornecer filtros básicos e ajustes simples de imagem.
- Permitir adicionar textos e elementos decorativos.

### 1.2 Público-alvo
- Criadores de conteúdo iniciantes e intermediários.
- Pequenos negócios que querem montar posts/stories sem ferramentas complexas.

### 1.3 Métricas de Sucesso (MVP)
- Usuário consegue criar um story em menos de 2 minutos.
- Exportação funcional em PNG/JPG/WebP.
- Interface fluida em desktop (Chrome, Edge, Safari).

---

## 2. Escopo do MVP

### 2.1 Features Inclusas
- Templates de colagem (grade, mosaico, vazio).
- Upload de fotos via drag-and-drop e botão.
- Filtros básicos (Natural, Quente, Frio, Vintage).
- Ajustes: brilho, saturação, zoom.
- Adicionar textos, stickers, formas e linhas.
- Pré-visualização no formato Story (9:16).
- Exportação simulada (placeholder para html2canvas/canvas).

### 2.2 Features Fora do Escopo (MVP)
- Login, autenticação e persistência em nuvem.
- Integração com Instagram API.
- Biblioteca de músicas.
- Colaboração multi-usuário.
- Animações e vídeo.

---

## 3. Experiência do Usuário (UX)

### 3.1 Layout Principal
- **Sidebar esquerda:** navegação (Templates, Mídia, Elementos, Texto, Música, Feed, Ajustes).
- **Centro:** canvas em formato Story (9:16), com fundo editável.
- **Direita:** ferramentas contextuais (filtros, ajustes, upload, fotos recentes, quick-add).

### 3.2 Fluxo Principal
1. Usuário abre a página.
2. Vê o canvas com imagem padrão.
3. Pode arrastar fotos do feed para o canvas ou fazer upload.
4. Aplica filtros e ajustes.
5. Adiciona textos/elementos.
6. Exporta ou salva (simulação).

### 3.3 Referência Visual
- Inspiração: Wanderlab e similares.
- Estilo: limpo, minimalista, com sombras suaves e cantos arredondados.

---

## 4. Requisitos Funcionais

### 4.1 RF01 — Navegação
- Sidebar com itens de menu clicáveis.
- Estado ativo visual no item selecionado.

### 4.2 RF02 — Canvas
- Canvas proporção 9:16 (Story).
- Suporte a imagem de fundo.
- Suporte a overlay de grade para templates.
- Suporte a elementos arrastáveis (texto, sticker, forma, linha).

### 4.3 RF03 — Fotos
- Drag-and-drop de fotos do feed para o canvas.
- Upload via input de arquivo múltiplo.
- Preview das fotos no feed.
- Limite de **10 MB por imagem**.
- Validação de tipo e tamanho antes do processamento.

### 4.4 RF04 — Filtros e Ajustes
- Filtros preset: Original, Clarea, Avellã, Pôr do sol.
- Sliders: brilho (0-200%), saturação (0-200%), zoom (100-200%).
- Aplicação em tempo real via CSS filters e transform.

### 4.5 RF05 — Texto e Elementos
- Adicionar texto com posicionamento livre.
- Adicionar sticker, forma e linha.
- Estilo de texto: cor, tamanho e fonte.

### 4.6 RF06 — Exportação
- Botões: Salvar, Pré-visualizar, Exportar, Limpar.
- Exportação placeholder (integração futura com html2canvas ou canvas API).

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance
- Carregamento inicial < 2s em conexão 4G.
- Filtros e ajustes sem lag perceptível.

### 5.2 Compatibilidade
- Chrome, Edge, Safari (últimas 2 versões).
- Desktop-first (responsividade básica).

### 5.3 Acessibilidade
- Contraste mínimo 4.5:1.
- Botões com área mínima de toque de 44x44px.

### 5.4 Segurança e Privacidade
- Sem login, sem coleta de dados pessoais e sem envio de arquivos para servidor no MVP.
- Limite de upload: **10 MB por imagem**.
- Validação de tipo e tamanho de arquivo no cliente.
- Conteúdo do usuário tratado como não confiável (sanitização no DOM).
- Política de recursos externos: preferir HTTPS; minimizar dependências de terceiros.

### 5.5 Confiabilidade
- Tratamento de erro amigável em upload e exportação.

---

## 6. Estrutura de Gates de Validação

Cada gate representa um conjunto de features prontas e validadas antes de avançar para o próximo.

### Gate 1 — Visual + Fundamentos
**Objetivo:** Ter a estrutura visual e os fundamentos da aplicação funcionando.

**Critérios de Aceitação:**
- [ ] Layout de 3 colunas responsivo (sidebar, canvas, ferramentas).
- [ ] Design system aplicado (cores, tipografia, espaçamento, sombras, cantos arredondados).
- [ ] Navegação funcional com estados ativos.
- [ ] Canvas Story (9:16) com imagem de fundo padrão.
- [ ] Topbar com ações (Limpar, Salvar, Pré-visualizar, Exportar).
- [ ] Componentes base estilizados (botões, chips, sliders, cards de filtro).
- [ ] Responsividade básica validada em desktop.

**Entregáveis:**
- Estrutura HTML/CSS/JS do MVP.
- Documento de design system (ADRs visuais).
- Telas: sidebar, canvas, painel de ferramentas.

---

### Gate 2 — Colagem + Upload de Imagens
**Objetivo:** Permitir que o usuário trabalhe com múltiplas fotos e templates de colagem.

**Critérios de Aceitação:**
- [ ] Templates de colagem aplicáveis (vazio, grid3, mosaic).
- [ ] Overlay de grade visual no canvas.
- [ ] Upload de fotos via botão e drag-and-drop.
- [ ] Feed de fotos recentes arrastáveis para o canvas.
- [ ] Troca de imagem de fundo ao soltar foto no canvas.
- [ ] Preview das fotos no feed com thumbnails.

**Entregáveis:**
- Templates de colagem funcionais.
- Sistema de drag-and-drop de fotos.
- Feed de fotos recentes.

---

### Gate 3 — Filtros e Ajustes
**Objetivo:** Permitir edição visual básica da imagem de fundo.

**Critérios de Aceitação:**
- [ ] Filtros preset aplicáveis (Original, Clarea, Avellã, Pôr do sol).
- [ ] Sliders de brilho, saturação e zoom funcionais.
- [ ] Aplicação em tempo real sem recarregar a página.
- [ ] Preview dos filtros nos cards da direita.
- [ ] Reset de ajustes.

**Entregáveis:**
- Sistema de filtros CSS.
- Sliders de ajustes integrados.
- Reset de edição.

---

### Gate 4 — Texto e Elementos
**Objetivo:** Permitir adicionar e estilizar textos e elementos decorativos.

**Critérios de Aceitação:**
- [ ] Adicionar texto com posicionamento livre.
- [ ] Adicionar sticker, forma e linha.
- [ ] Estilo de texto: cor, tamanho, fonte.
- [ ] Seleção de elemento com destaque visual.
- [ ] Arrastar elementos pelo canvas.
- [ ] Remover elemento (click + delete/backspace).

**Entregáveis:**
- Quick-add de elementos.
- Painel de estilo de texto.
- Sistema de seleção e arraste.

---

### Gate 5 — Exportação e Polimento
**Objetivo:** Preparar o produto para uso real.

**Critérios de Aceitação:**
- [ ] Exportação real em PNG/JPG/WebP (html2canvas ou canvas API).
- [ ] Modal de pré-visualização em tela cheia.
- [ ] Feedback visual em todos os botões.
- [ ] Tratamento de erros (upload inválido, etc.).
- [ ] Performance audit (Lighthouse) > 80.

**Entregáveis:**
- Função de exportação funcional.
- Modal de preview.
- Relatório de performance.

---

## 7. Roadmap

| Gate | Tema | Duração Estimada | Status |
|------|------|------------------|--------|
| 1 | Visual + Fundamentos | 1 semana | Concluído |
| 2 | Colagem + Upload | 1 semana | Concluído |
| 3 | Filtros e Ajustes | 3 dias | Concluído |
| 4 | Texto e Elementos | 3 dias | Concluído |
| 5 | Exportação e Polimento | 3 dias | Próximo |

---

## 8. Referências

- Benchmark: `best-in-class.md`
- Protótipo funcional: `index.html`
- Protótipos conceituais: `conceito-*.html`

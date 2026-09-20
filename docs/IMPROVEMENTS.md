# Melhorias para my-story-maker

## 🆕 Recém implementado (tema, exportação e templates)

- [x] Tema claro/escuro com tokens em `css/variables.css` (`data-theme` no `<html>`, `js/theme.js`)
- [x] Preferência de tema em `localStorage`, respeito ao `prefers-color-scheme` e sync entre abas
- [x] Script anti-flash inline no `<head>` (sem "flash" branco ao carregar)
- [x] Exportação em 1x / 2x / 3x (`Export.setScale`)
- [x] Copiar o story para a área de transferência (Clipboard API)
- [x] Compartilhar via Web Share API nível 2 (fallback com aviso)
- [x] Sugestão inteligente de template conforme a quantidade de fotos (`Templates.suggestFor`)
- [x] Acessibilidade: `aria-label` em botões de ícone, `role="dialog"`/`aria-modal` nos modais, `aria-live` nos toasts
- [x] Testes unitários de `Theme`, `Export` e `Templates` (`src/__tests__/features.test.ts`)
- [x] CI no GitHub Actions (lint + tipos + testes + build)

## ✅ Já Implementado
- [x] Sistema de camadas com ordenação, visibilidade e bloqueio
- [x] Resize com alças de 8 pontos
- [x] Rotação de elementos
- [x] Histórico Undo/Redo (Ctrl+Z, Ctrl+Y)
- [x] Snap guides (básico)
- [x] Biblioteca de templates
- [x] Persistência IndexedDB (projetos)
- [x] Exportação PNG
- [x] Painel avançado de propriedades
- [x] Sistema de projetos (salvar/carregar/excluir)
- [x] Editor de texto com formatação básica
- [x] Música com waveform
- [x] Filtros (Original, P&B, Amarelo, Vermelho)

## 🔄 Melhorias em Andamento
- [x] Corrigir encoding do index.html
- [x] Integrar todos os sistemas no app.js
- [x] Corrigir mapeamento de filtros
- [x] Criar CSS para novos painéis
- [x] Adicionar modal de seleção de formato na exportação (menu do botão Exportar)

## 📋 Próximas Melhorias Prioritárias

### 1. Editor de Texto Rico ✨
- Toolbar com negrito, itálico, sublinhado
- Seleção de cores com palette
- Tamanho de fonte dropdown
- Alinhamento de texto
- Espaçamento entre linhas
- Sombras e efeitos de texto

### 2. Biblioteca SVG 🎨
- Ícones pré-definidos (corações, estrelas, setas)
- Formas geométricas variadas
- Elementos decorativos (bordas, molduras)
- Stickers animados

### 3. Exportação Avançada 📤
- [x] Opções: PNG, JPG, WEBP
- [x] Tamanho de saída (1x, 2x, 3x)
- [x] Copiar para a área de transferência
- [x] Compartilhamento nativo
- [x] **Pronto para o Instagram** — JPEG exato 1080×1920 (9:16) ou 1080×1080 (1:1), fundo opaco, compressão automática até ficar abaixo de 8 MB, prévia com dimensões e tamanho, legenda com contador de 2200 caracteres e envio pelo Web Share API no celular
- [ ] GIF animado (sequência de quadros)
- [ ] Publicação direta no Instagram — **impossível sem backend**: a Content Publishing API exige conta Business/Creator vinculada a uma Página do Facebook, hospedagem da imagem em URL HTTPS pública e não aceita stickers, enquetes, links ou música. Para contas pessoais não existe caminho automatizado (o deep link `instagram-stories://share` é bloqueado pelos navegadores), por isso o fluxo entregue é "pronto para o Instagram"
- [ ] compressão ajustável (controle de qualidade na UI)

### 4. Snap Guides Inteligentes 📐
- Linhas guia ao centralizar
- Alinhamento automático a bordas
- Distâncias iguais entre elementos
- Grade de referência opcional

### 5. Performance ⚡
- Lazy loading de imagens
- Virtualização do feed
- Cache de templates
- Otimização de renderização

### 6. UX/UI 💎
- Tooltip nos botões
- Feedback visual de ações
- Animações suaves
- Loading states

### 7. Acessibilidade ♿
- [x] ARIA labels nos botões de ícone
- [x] Modais com `role="dialog"` / `aria-modal`
- [x] Toasts com `aria-live="polite"`
- [ ] Navegação por teclado completa (foco preso dentro dos modais)
- [ ] Auditoria de contraste (WCAG AA) nos dois temas
- [ ] Screen reader support

### 8. Recursos Avançados 🚀
- Grupos de elementos (agrupar/desagrupar)
- Blend modes
- Máscaras de recorte
- Undo/redo por camada
- Undo/redo granular

## 🔧 Melhorias Técnicas

### CSS
- [x] Variáveis CSS para tema claro/escuro
- [ ] Responsividade mobile aprimorada
- [ ] Animações CSS para transições
- [ ] Melhorias no design dos painéis

### JavaScript
- [ ] Modularização completa (ES6 modules)
- [ ] Tratamento de erros centralizado
- [ ] Logging e debugging
- [x] Testes unitários (Vitest + jsdom)
- [ ] Code splitting

### Funcionalidades
- [ ] Zoom no canvas
- [ ] Rolar para navegar
- [ ] Copiar/colar elementos
- [ ] Duplicar elementos
- [ ] Agrupar elementos
- [ ] Camadas vinculadas (linked layers)

## 📱 Mobile
- [ ] Touch gestures otimizados
- [ ] Layout responsivo para tablets
- [ ] Botões maiores para touch
- [ ] Swipe para navegar entre camadas

## 🎵 Música
- [ ] Lista de músicas salvas
- [ ] Fade in/out
- [ ] Loop
- [ ] Volume por faixa
- [ ] Sync com timing do story

## 📊 Templates
- [ ] Templates personalizados
- [ ] Salvar templates usados
- [ ] Categorias de templates
- [ ] Templates sazonais

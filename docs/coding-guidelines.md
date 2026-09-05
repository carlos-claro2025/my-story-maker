# Coding Guidelines — my-story-maker

**Versão:** 0.1.0  
**Data:** 2026-08-29  
**Autor:** Karlo  

---

## 1. Princípios Gerais

1. **Vanilla first:** Sem frameworks, sem bundlers, sem dependências desnecessárias.
2. **HTML semântico:** Usar tags HTML5 corretamente (`<header>`, `<main>`, `<aside>`, `<section>`, `<button>`, etc.).
3. **CSS moderno:** Preferir CSS Variables, CSS Grid, Flexbox, aspect-ratio.
4. **JS modular:** Separar responsabilidades em arquivos diferentes, mesmo sem módulos ES6.
5. **Acessibilidade:** Sempre considerar contraste, tamanhos mínimos e navegação por teclado.
6. **Performance:** Evitar reflows desnecessários, usar `will-change` com moderação, otimizar imagens.
7. **Segurança:** Sanitizar inputs, validar arquivos, evitar XSS.

---

## 2. Estrutura de Arquivos

### 2.1 Convenção de Nomes
- **Arquivos CSS:** `kebab-case.css` (ex: `layout.css`, `filter-card.css`)
- **Arquivos JS:** `kebab-case.js` (ex: `drag-drop.js`, `filter-engine.js`)
- **Classes CSS:** `kebab-case` (ex: `.filter-card`, `.btn-primary`)
- **IDs CSS:** `kebab-case` (ex: `#bg-image`, `#filter-grid`)
- **Variáveis JS:** `camelCase` (ex: `currentFilter`, `selectedElement`)
- **Constantes JS:** `UPPER_SNAKE_CASE` (ex: `MAX_FILE_SIZE`, `DEFAULT_ASPECT_RATIO`)

### 2.2 Organização
```
css/
├── variables.css    # CSS Variables globais
├── reset.css        # Reset/normalize
├── layout.css       # Grid, sidebar, center, tools
├── components.css   # Botões, cards, sliders, inputs
├── filters.css      # Estilos de filtros e ajustes
└── utils.css        # Utilitários diversos

js/
├── app.js           # Inicialização e wiring principal
├── state.js         # Estado global da aplicação
├── filters.js       # Lógica de filtros e ajustes
├── drag-drop.js     # HTML5 DnD + Pointer Events
├── elements.js      # Texto, sticker, forma, linha
├── export.js        # Exportação PNG/JPG/WebP
└── utils.js         # Funções auxiliares
```

---

## 3. HTML

### 3.1 Regras
- Sempre incluir `lang="pt-br"` no `<html>`
- Sempre incluir viewport meta tag
- Usar `alt` em todas as imagens
- Usar `<button>` para ações, `<a>` para links
- Evitar `onclick` inline quando possível (preferir addEventListener)
- Manter estrutura plana e legível

### 3.2 Exemplo
```html
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>my-story-maker</title>
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/layout.css" />
</head>
<body>
  <div class="app">
    <aside class="sidebar">...</aside>
    <main class="center">...</main>
    <aside class="tools">...</aside>
  </div>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 4. CSS

### 4.1 Variáveis
```css
:root {
  --color-bg: #f3f4f6;
  --color-surface: #ffffff;
  --color-text: #111111;
  --color-muted: rgba(0, 0, 0, 0.6);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 22px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 25px 60px rgba(0, 0, 0, 0.18);
}
```

### 4.2 Convenções
- Usar `box-sizing: border-box` globalmente
- Preferir unidades relativas (`rem`, `%`, `fr`) quando possível
- Usar `gap` em vez de margins para espaçamento entre elementos
- Agrupar propriedades relacionadas
- Comentar seções complexas

### 4.3 Componentes
```css
/* Botão base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: var(--color-surface);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn.primary {
  background: var(--color-text);
  color: var(--color-surface);
  border-color: var(--color-text);
}
```

### 4.4 Responsividade
```css
.app {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  height: 100vh;
}

@media (max-width: 1100px) {
  .app {
    grid-template-columns: 220px 1fr 280px;
  }
}

@media (max-width: 860px) {
  .app {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
```

---

## 5. JavaScript

### 5.1 Modularidade
Cada arquivo JS deve ter uma responsabilidade clara. Usar IIFE ou objeto module para evitar poluir o escopo global.

```javascript
// filters.js
const FilterEngine = (() => {
  const presets = {
    none: 'none',
    clarea: 'brightness(1.08) saturate(0.9) contrast(1.05)',
    avella: 'sepia(0.25) saturate(1.15) brightness(1.03)',
    'por-do-sol': 'sepia(0.35) saturate(1.25) brightness(1.02) hue-rotate(-8deg)'
  };

  function apply(element, preset, adjustments) {
    const base = presets[preset] || 'none';
    const extra = `brightness(${adjustments.brightness}%) saturate(${adjustments.saturation}%)`;
    element.style.filter = `${base} ${extra}`.trim();
  }

  return { apply };
})();
```

### 5.2 Estado Global
```javascript
// state.js
const AppState = (() => {
  const state = {
    currentFilter: 'none',
    brightness: 100,
    saturation: 100,
    zoom: 100,
    elements: [],
    selectedElement: null
  };

  function get(key) {
    return state[key];
  }

  function set(key, value) {
    state[key] = value;
  }

  function getAll() {
    return { ...state };
  }

  return { get, set, getAll };
})();
```

### 5.3 Event Listeners
```javascript
// Preferir addEventListener
document.getElementById('uploadInput').addEventListener('change', handleUpload);

// Evitar onclick inline no HTML
// <button onclick="exportStory()"> → <button id="exportBtn"> + addEventListener
```

### 5.4 Manipulação de DOM
```javascript
// Criar elementos de forma segura
function createTextElement(text, x, y) {
  const el = document.createElement('div');
  el.className = 'text-element';
  el.textContent = text; // textContent previne XSS
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  return el;
}
```

### 5.5 Drag and Drop
```javascript
// Usar Pointer Events para elementos internos
element.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  selectElement(element);
  element.setPointerCapture(e.pointerId);
  // ...
});

// HTML5 DnD para upload externo
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  handleFiles(files);
});
```

---

## 6. Segurança

### 6.1 Upload de Arquivos
```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo excede o limite de 10 MB.');
  }
  return true;
}
```

### 6.2 Sanitização
```javascript
// Sempre usar textContent para conteúdo do usuário
element.textContent = userInput; // Seguro

// Nunca usar innerHTML com conteúdo não confiável
// element.innerHTML = userInput; // PERIGOSO
```

### 6.3 URLs Externas
- Preferir HTTPS para todas as URLs externas
- Validar protocolo antes de atribuir a `src` ou `href`

---

## 7. Performance

### 7.1 Imagens
- Usar `loading="lazy"` em imagens não críticas
- Limitar tamanho de arquivo (10 MB máximo)
- Usar `object-fit: cover` para evitar distorções
- Considerar `will-change: transform` apenas em elementos animados

### 7.2 Filtros CSS
```css
.background-image {
  transition: filter 0.2s ease, transform 0.2s ease;
  /* Evitar transitions muito longas */
}
```

### 7.3 Eventos
- Usar `requestAnimationFrame` para atualizações visuais frequentes
- Debounce em eventos de input quando apropriado

---

## 8. Acessibilidade

### 8.1 Contraste
- Mínimo 4.5:1 para texto normal (WCAG AA)
- Mínimo 3:1 para texto grande

### 8.2 Tamanhos
- Botões: mínimo 44x44px
- Fontes: mínimo 16px para corpo

### 8.3 Navegação
- Todos os elementos interativos devem ser focáveis via teclado
- Estados de foco visíveis (`:focus-visible`)
- Usar `aria-label` quando o texto não for suficiente

---

## 9. Testes Manuais por Gate

Cada gate deve passar por:
1. **Funcional:** Testar todos os critérios de aceitação
2. **Browser:** Chrome, Edge, Safari (últimas 2 versões)
3. **Performance:** Lighthouse > 80
4. **Segurança:** Sem erros no console, uploads validados
5. **Acessibilidade:** Navegação por teclado, contraste ok

---

## 10. Padrões de Código

### 10.1 Nomes de Arquivos
```
index.html
css/variables.css
css/layout.css
js/app.js
js/state.js
```

### 10.2 Nomes de Classes CSS
```
.sidebar
.nav-item
.nav-item.active
.btn
.btn-primary
.filter-card
.filter-card.active
```

### 10.3 Nomes de Variáveis JS
```javascript
const currentFilter = 'none';
let selectedElement = null;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
```

### 10.4 Comentários
```javascript
// Gate 2 - Upload validation
function validateFile(file) {
  // ...
}

// TODO: implementar redimensionamento automático
// FIXME: erro ao arrastar no mobile
```

---

## 11. Integração com PRD e ADR

- **PRD:** Cada feature implementada deve rastrear para um requisito funcional (RF01-RF06)
- **ADR:** Decisões técnicas devem respeitar os ADRs aprovados
- **Security:** Seguir as diretrizes de `security-redteam.md`

---

## 12. Review e Aprovação

Antes de considerar um gate completo:
1. Code review seguindo estes guidelines
2. Testes manuais aprovados
3. Documentação atualizada
4. Sem regressões nos gates anteriores

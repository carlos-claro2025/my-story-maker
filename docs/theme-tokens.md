# Sistema de temas (claro/escuro)

O editor usa **um único arquivo de tokens** (`public/css/variables.css`) como fonte de verdade das
cores. Nenhum outro CSS deve conter cor literal em hexadecimal ou `rgba()` para superfícies de
interface — sempre use `var(--token)`.

## Como funciona

1. `public/index.html` tem um script inline no `<head>` (antes do `<link>` do CSS) que lê
   `localStorage.storyMaker_theme` e escreve `data-theme` no `<html>`. Isso evita o "flash" branco
   no carregamento.
2. `public/js/theme.js` expõe `window.Theme` e é inicializado em `app.js` via `boot('Theme', …)`.
3. `variables.css` define `:root` como **tema escuro** (padrão) e `[data-theme='light']` com os
   mesmos nomes de token em valores claros.

## API (`window.Theme`)

| Membro | Descrição |
| --- | --- |
| `Theme.current` | Tema ativo lido do atributo `data-theme` (`'dark'` \| `'light'`) |
| `Theme.resolve()` | Preferência salva em `localStorage`; se não houver, usa `prefers-color-scheme` |
| `Theme.apply(mode, persist?)` | Aplica o tema, atualiza `meta[name=theme-color]`, sincroniza o botão e dispara `themechange` |
| `Theme.toggle()` | Alterna entre claro e escuro (sempre persiste) |
| `Theme.sync()` | Reflete o estado no botão `#themeToggle` (`aria-pressed`, `aria-label`, ícone) |
| `Theme.init()` | Aplica o tema resolvido, liga o clique do botão, escuta `prefers-color-scheme` e o evento `storage` (sync entre abas) |

Valores inválidos são normalizados para `dark`. O `localStorage` é lido/escrito dentro de
`try/catch` para não quebrar em modo privado ou com a quota cheia.

## Grupos de tokens

| Grupo | Exemplos |
| --- | --- |
| Base | `--bg`, `--panel`, `--border`, `--text`, `--muted`, `--accent`, `--danger` |
| Aliases dos painéis | `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-hover`, `--text-primary`, `--text-muted`, `--on-accent` |
| Superfícies estruturais | `--sidebar-from/to`, `--tools-from/to`, `--topbar-bg`, `--center-bg`, `--statusbar-bg`, `--canvas-bg/border` |
| Superfícies de controle | `--btn-bg`, `--card-bg`, `--tile-bg`, `--inset-bg`, `--chip-bg`, `--kbd-bg`, `--sticker-bg` |
| Texto secundário | `--text-soft`, `--text-dim`, `--text-dim-2`, `--text-faint` |
| Tons do accent | `--accent-soft`, `--accent-soft-border`, `--accent-tint`, `--accent-border`, `--accent-bright`, `--accent-pale` |
| Feedback | `--toast-*`, `--danger-strong*`, `--ok` |
| Cromo | `--chip-overlay-*`, `--scrim`, `--tooltip-*`, `--scrollbar*`, `--loading-from/to` |

## Convenções

- **Novas cores de UI devem virar token** nos dois blocos (`:root` e `[data-theme='light']`).
- Cores literais são aceitas apenas quando não pertencem ao tema: cor padrão dos seletores de
  cor (`#textColor`, `#shapeColor`), texto sobre fundo colorido sólido (`.btn-danger`, toasts) e
  tons aplicados por filtros CSS dentro do canvas.
- `meta[name="theme-color"]` é atualizado por `Theme.apply` (`#0e0e0e` no escuro, `#f5f6f8` no claro).
- `color-scheme` acompanha o tema, o que ajusta automaticamente scrollbars e controles nativos.

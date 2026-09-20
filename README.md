# 📱 my-story-maker

> **Editor de stories e collages** para Instagram — 100% no navegador, sem backend e sem upload de fotos para servidores.

## 🚀 Principais funcionalidades

- **Editor de stories** — Arraste e solte imagens, adicione textos, adesivos, formas e linhas com seleção, redimensionamento e rotação no canvas.
- **Collages e templates** — Layouts prontos (tela inteira, mosaico e grade 3×3) com troca de foto por célula e sugestão automática de layout conforme a quantidade de fotos.
- **Filtros e ajustes** — Presets (grayscale, sépia, etc.) mais brilho, contraste, saturação, temperatura, exposição, vinheta e desfoque — globais ou por célula.
- **Tema claro/escuro** — Alternância no topbar, preferência salva em `localStorage`, respeito ao `prefers-color-scheme` do sistema e sincronização entre abas, sem "flash" branco ao carregar.
- **Exportação flexível** — PNG, JPG e WEBP em 1x, 2x ou 3x, além de **copiar para a área de transferência** e **compartilhar** via Web Share API quando o navegador suporta.
- **Salvar e retomar** — Projetos salvos no IndexedDB, autosave a cada 30 s, exportação/importação de arquivo `.json` editável e pré-visualização.
- **Histórico** — Desfazer/refazer, camadas com reordenação e atalhos de teclado (consulte `?` no editor).
- **Música de fundo** — Player embutido para trilha sonora do story.
- **Interface responsiva** — Layout adaptável para desktop, tablet e celular, com gaveta lateral de ferramentas no mobile.
- **Acessibilidade** — Botões com `aria-label`, modais com `role="dialog"`/`aria-modal`, toasts com `aria-live` e navegação por teclado nos controles principais.
- **Privacidade** — Todo o processamento acontece no cliente; as imagens nunca saem do dispositivo.

## 📦 Instalação local

```bash
git clone https://github.com/carlos-claro2025/my-story-maker.git
cd my-story-maker
npm install
npm run dev
```

O editor estático fica em `public/` e pode ser servido diretamente:

```bash
cd public
python -m http.server 8765
# abra http://localhost:8765/
```

## 🧪 Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Next.js) |
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (Vitest + jsdom) |
| `npx tsc --noEmit` | Checagem de tipos |

## 🔄 Integração contínua

O workflow em `.github/workflows/ci.yml` roda lint, checagem de tipos, testes e build em cada push e pull request para `master`/`main`.

## 📁 Estrutura

```
app/                 App shell do Next.js
public/              Editor estático (HTML/CSS/JS puro)
  index.html
  css/               Tokens de tema (variables.css) + estilos
  js/                Módulos: State, Theme, Templates, Filters, Export, ...
src/__tests__/       Testes unitários dos módulos do editor
docs/                PRD, ADR, guias e backlog de melhorias
```

## 📄 Licença

2026 – Carlos Claro

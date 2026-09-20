# 📱 my-story-maker

> **Editor de stories e collages** para Instagram — 100% no navegador, sem backend e sem upload de fotos para servidores.

## 🚀 Principais funcionalidades

- **Editor de stories** — Arraste e solte imagens, adicione textos, adesivos, formas e linhas com seleção, redimensionamento e rotação no canvas.
- **Collages e templates** — Layouts prontos (tela inteira, mosaico e grade 3×3) com troca de foto por célula e sugestão automática de layout conforme a quantidade de fotos.
- **Filtros e ajustes** — Presets (grayscale, sépia, etc.) mais brilho, contraste, saturação, temperatura, exposição, vinheta e desfoque — globais ou por célula.
- **Tema claro/escuro** — Alternância no topbar, preferência salva em `localStorage`, respeito ao `prefers-color-scheme` do sistema e sincronização entre abas, sem "flash" branco ao carregar.
- **Exportação flexível** — PNG, JPG e WEBP em 1x, 2x ou 3x, além de **copiar para a área de transferência** e **compartilhar** via Web Share API quando o navegador suporta.
- **Pronto para o Instagram** — Gera o JPEG exato que o Instagram aceita (1080×1920 no story, 1080×1080 no post), com fundo opaco, compressão automática abaixo de 8 MB, prévia com dimensões e tamanho, legenda com contador de 2200 caracteres e um clique para salvar ou compartilhar direto do celular.
- **Salvar e retomar** — Projetos salvos no IndexedDB, autosave a cada 30 s, exportação/importação de arquivo `.json` editável e pré-visualização.
- **Histórico** — Desfazer/refazer, camadas com reordenação e atalhos de teclado (consulte `?` no editor).
- **Música de fundo** — Player embutido para trilha sonora do story.
- **Interface responsiva** — Layout adaptável para desktop, tablet e celular, com gaveta lateral de ferramentas no mobile.
- **Acessibilidade** — Botões com `aria-label`, modais com `role="dialog"`/`aria-modal`, toasts com `aria-live` e navegação por teclado nos controles principais.
- **Privacidade** — Todo o processamento acontece no cliente; as imagens nunca saem do dispositivo.

## 📸 Publicar no Instagram

O editor gera um arquivo **pronto para publicar** — sem backend, sem login e sem enviar nada para servidores.

1. Monte o story (9:16) ou o post (1:1) no canvas.
2. Clique em **Exportar → Pronto para o Instagram…**.
3. Confira a prévia: o status mostra as dimensões exatas e o tamanho final do arquivo.
4. Escreva a legenda (até 2200 caracteres) — no celular ela vai junto no compartilhamento.
5. Toque em **Compartilhar…** e escolha o Instagram, ou **Baixar JPEG** para postar pelo app.

O arquivo sai em JPEG com fundo opaco (sem cantos pretos), 1080×1920 no story e 1080×1080 no post, e a qualidade é reduzida automaticamente até ficar abaixo do limite de 8 MB do Instagram.

> **Por que não há publicação automática?** A Content Publishing API do Instagram só funciona para contas **Business/Creator** vinculadas a uma Página do Facebook, exige a imagem hospedada em uma URL HTTPS pública (ou seja, um backend) e não aceita stickers, enquetes, links ou música. Para contas pessoais não existe caminho automatizado — o deep link `instagram-stories://share` é bloqueado pelos navegadores. Por isso o fluxo entregue é "pronto para o Instagram".

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

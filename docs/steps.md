# Migração e Melhoria do Projeto

## 1. Limpeza de Código
- Remover a pasta duplicada `js/`.
- Consolidar arquivos estáticos em `public/`.

## 2. Configuração do Projeto
- Criar `package.json` na raiz (já feito).
- Copiar `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json` para a raiz.

## 3. Linting e Formatação
- Adicionar `.eslintrc.cjs`.
- Instalar `eslint` e `eslint-config-next`.
- Adicionar `prettier` (opcional).

## 4. Testes
- Instalar `vitest` e `@testing-library/react`.
- Criar `vitest.config.ts` e `src/setupTests.ts`.
- Escrever testes unitários para `Layers`, `History`, `Export`.

## 5. Conversão para TypeScript
- Renomear arquivos JS para TS.
- Adicionar tipos para `window.State` e módulos.
- Atualizar imports.

## 6. Gerenciamento de Estado
- Substituir `window.State` por um store (ex.: Zustand).

## 7. Segurança e Acessibilidade
- Validar uploads de imagens.
- Sanitizar textos.
- Adicionar `aria-` atributos.

## 8. Performance
- Otimizar manipulação DOM.
- Considerar canvas para renderização.

## 9. Documentação
- Criar `CONTRIBUTING.md`, `CHANGELOG.md`.

## 10. Build Consolidado
- Unificar Next.js e assets estáticos.
- Configurar scripts de build.

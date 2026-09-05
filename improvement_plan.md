# Improvement Plan

## Observations & Potential Improvements

1. **Duplicate Code** – `public/js/` and `js/` contain identical files. Keep only one source of truth.
2. **Mixed Build Systems** – `next.config.js` & `wasmer.toml` suggest a Next.js build, but the app also serves static files from `public/`. Consolidate to a single build pipeline (e.g., Next.js pages + static assets).
3. **Global State** – `window.State` is a global mutable object. Consider using a state library (e.g., Zustand, Redux) for better testability and isolation.
4. **TypeScript** – Only `app/` contains `.tsx`. The rest of the codebase is plain JS. Adding TS to the editor modules would catch bugs early.
5. **Testing** – No tests present. Add unit tests for core modules (`Layers`, `History`, `Export`) using Jest or Vitest.
6. **Linting/Formatting** – No `.eslintrc` or `prettier`. Add them to enforce code style.
7. **Security** – `security‑redteam.md` exists but no runtime checks. Validate user‑uploaded images, sanitize text inputs, and guard against XSS.
8. **Accessibility** – UI elements lack ARIA attributes. Add `aria-label` to buttons, use semantic HTML.
9. **Performance** – Heavy DOM manipulation in `app.js`. Consider virtualizing large canvases or using a canvas element instead of DOM nodes for many elements.
10. **Documentation** – `README.md` is good, but add a `CONTRIBUTING.md` and a `CHANGELOG.md`.

## Suggested Next Steps

1. **Clean up**: Remove duplicate `js/` folder or symlink to `public/js/`.
2. **Add TS**: Convert `app.js` and related modules to TypeScript.
3. **Set up linting**: Create `.eslintrc.cjs` and `.prettierrc`.
4. **Add tests**: Write tests for `Layers`, `History`, `Export` using Jest or Vitest.
5. **Improve state**: Replace global `window.State` with a lightweight store.
6. **Security hardening**: Validate inputs, sanitize text, guard against XSS.
7. **Accessibility**: Add ARIA attributes and semantic HTML.
8. **Performance**: Optimize DOM usage, consider canvas rendering for large projects.
9. **Documentation**: Add `CONTRIBUTING.md`, `CHANGELOG.md`.
10. **Build consolidation**: Align Next.js and static assets into a single pipeline.

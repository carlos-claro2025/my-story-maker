/* Tema claro/escuro do editor.
   A preferência fica em localStorage (storyMaker_theme) e o atributo
   data-theme no <html> seleciona os tokens de cor de css/variables.css.
   O valor inicial é aplicado inline no <head> para evitar "flash" branco. */
(function () {
  const STORAGE_KEY = 'storyMaker_theme';
  const MEDIA_QUERY = '(prefers-color-scheme: light)';
  const MODES = ['dark', 'light'];
  const THEME_COLOR = { dark: '#0e0e0e', light: '#f5f6f8' };
  const ICON = { dark: '🌙', light: '☀️' };
  const LABEL = { dark: 'Tema escuro (clique para o claro)', light: 'Tema claro (clique para o escuro)' };

  function readStored() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return MODES.indexOf(saved) >= 0 ? saved : null;
    } catch (err) {
      return null;
    }
  }

  function systemPrefers() {
    try {
      return window.matchMedia && window.matchMedia(MEDIA_QUERY).matches ? 'light' : 'dark';
    } catch (err) {
      return 'dark';
    }
  }

  function normalize(mode) {
    return MODES.indexOf(mode) >= 0 ? mode : 'dark';
  }

  const Theme = {
    STORAGE_KEY,

    get current() {
      return normalize(document.documentElement.getAttribute('data-theme'));
    },

    /* Preferência salva; cai para o tema do sistema quando nunca escolhida */
    resolve() {
      return readStored() || systemPrefers();
    },

    apply(mode, persist) {
      const next = normalize(mode);
      document.documentElement.setAttribute('data-theme', next);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', THEME_COLOR[next]);
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (err) {
          /* modo privado / quota cheia: o tema vale só para esta sessão */
        }
      }
      this.sync();
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
      return next;
    },

    toggle() {
      return this.apply(this.current === 'dark' ? 'light' : 'dark', true);
    },

    /* Mantém o botão do topbar coerente com o tema ativo */
    sync() {
      const btn = document.getElementById('themeToggle');
      if (!btn) return;
      const mode = this.current;
      btn.textContent = ICON[mode];
      btn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', LABEL[mode]);
      btn.setAttribute('data-tooltip', LABEL[mode]);
      btn.title = LABEL[mode];
    },

    init() {
      this.apply(this.resolve(), false);

      const btn = document.getElementById('themeToggle');
      if (btn) btn.addEventListener('click', () => this.toggle());

      /* Sem escolha salva, seguir o sistema em tempo real */
      try {
        const mq = window.matchMedia(MEDIA_QUERY);
        const onChange = () => { if (!readStored()) this.apply(systemPrefers(), false); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      } catch (err) {
        /* navegador sem matchMedia: mantém o tema padrão */
      }

      /* Sincroniza entre abas abertas do editor */
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) this.apply(this.resolve(), false);
      });
    },
  };

  window.Theme = Theme;
})();

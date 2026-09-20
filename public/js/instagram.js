/* Fluxo "pronto para Instagram".
 *
 * A Content Publishing API oficial só publica em contas Business/Creator e exige
 * a imagem hospedada numa URL HTTPS pública — ou seja, precisa de um backend.
 * Para conta pessoal o caminho suportado pelo navegador é a Web Share API (folha
 * de compartilhamento do sistema no celular), com download como alternativa.
 * Nos dois casos a receita da imagem é a mesma: JPEG, 1080x1920, até 8 MB.
 */
window.Instagram = {
  MAX_BYTES: 8 * 1024 * 1024,
  QUALITY: 0.92,
  MIN_QUALITY: 0.5,
  MAX_CAPTION: 2200,
  SIZES: { '9:16': { w: 1080, h: 1920 }, '1:1': { w: 1080, h: 1080 } },

  _blob: null,
  _file: null,
  _url: null,
  _meta: null,
  _busy: false,

  /* --- utilidades puras ------------------------------------------------- */

  targetSize(ratio) {
    const key = ratio || (window.State && window.State.ratio) || '9:16';
    return this.SIZES[key] || this.SIZES['9:16'];
  },

  formatBytes(bytes) {
    if (!bytes || bytes < 0) return '0 KB';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  },

  filename(date) {
    const d = date || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return 'story-instagram-' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' +
      p(d.getDate()) + '_' + p(d.getHours()) + '-' + p(d.getMinutes()) + '.jpg';
  },

  /* --- geração da imagem ------------------------------------------------ */

  /* JPEG não guarda transparência: a imagem precisa ser desenhada em pixels
     exatos, senão o Instagram recorta ou distorce o story. */
  resample(canvas, w, h) {
    if (Math.abs(canvas.width - w) <= 1 && Math.abs(canvas.height - h) <= 1) return canvas;
    try {
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      const ctx = out.getContext('2d');
      if (!ctx) return canvas;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, w, h);
      return out;
    } catch (err) {
      console.warn('Não foi possível redimensionar para ' + w + 'x' + h, err);
      return canvas;
    }
  },

  /* Reduz a qualidade em passos até caber no limite do Instagram */
  async compress(toBlob) {
    let quality = this.QUALITY;
    let blob = await toBlob(quality);
    while (blob && blob.size > this.MAX_BYTES && quality > this.MIN_QUALITY) {
      quality = Math.max(this.MIN_QUALITY, Math.round((quality - 0.1) * 100) / 100);
      blob = await toBlob(quality);
    }
    return { blob, quality };
  },

  toJpegBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('blob vazio'))),
          'image/jpeg',
          quality
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  async buildBlob() {
    const phone = document.getElementById('phone');
    if (!phone) throw new Error('Canvas não encontrado');
    const size = this.targetSize();
    const cssWidth = phone.clientWidth || 380;
    // html2canvas renderiza em css px * scale; a escala já entrega ~1080 de largura
    const scale = Math.max(2, size.w / cssWidth);
    const raw = await window.Export.render(scale);
    const flat = window.Export.flatten(raw, window.Export.backgroundColor());
    const canvas = this.resample(flat, size.w, size.h);
    const { blob, quality } = await this.compress((q) => this.toJpegBlob(canvas, q));
    return { blob, quality, size };
  },

  async prepare() {
    const { blob, size, quality } = await this.buildBlob();
    this.revoke();
    this._blob = blob;
    this._meta = { bytes: blob.size, quality, size };
    this._file = new File([blob], this.filename(), { type: 'image/jpeg' });
    this._url = URL.createObjectURL ? URL.createObjectURL(blob) : null;
    return this._meta;
  },

  async getFile() {
    if (this._file) return this._file;
    const { blob } = await this.buildBlob();
    this._file = new File([blob], this.filename(), { type: 'image/jpeg' });
    return this._file;
  },

  revoke() {
    if (this._url && URL.revokeObjectURL) URL.revokeObjectURL(this._url);
    this._url = null;
    this._blob = null;
    this._file = null;
    this._meta = null;
  },

  /* --- compartilhamento ------------------------------------------------- */

  canShare(file) {
    if (!navigator.canShare || typeof window.File === 'undefined') return false;
    try {
      return navigator.canShare({ files: [file] });
    } catch (err) {
      return false;
    }
  },

  caption() {
    const el = document.getElementById('igCaption');
    return el ? String(el.value || '').trim() : '';
  },

  notify(msg, type) {
    if (window.showToast) window.showToast(msg, 2800, type || 'info');
    else console.log(msg);
  },

  async share() {
    if (this._busy) return;
    let file;
    try {
      file = await this.getFile();
    } catch (err) {
      console.error(err);
      return this.notify('Exportação indisponível neste ambiente', 'error');
    }
    if (!this.canShare(file)) {
      return this.notify('Compartilhar não é suportado aqui — baixe o JPEG', 'warning');
    }
    const text = this.caption();
    try {
      await navigator.share(text ? { files: [file], text } : { files: [file] });
      this.notify('Compartilhado', 'success');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.error(err);
      this.notify('Não foi possível compartilhar', 'error');
    }
  },

  async download() {
    if (this._busy) return;
    let file;
    try {
      file = await this.getFile();
    } catch (err) {
      console.error(err);
      return this.notify('Exportação indisponível neste ambiente', 'error');
    }
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      return this.notify('Falha ao salvar o JPEG', 'error');
    }
    // A legenda é copiada junto: no celular não dá para colar depois sem perder a imagem
    const text = this.caption();
    let copied = false;
    if (text && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        console.warn('Legenda não copiada', err);
      }
    }
    this.notify(
      copied ? 'JPEG salvo e legenda copiada' : 'JPEG salvo — poste pelo app do Instagram',
      'success'
    );
  },

  /* --- interface -------------------------------------------------------- */

  setStatus(text, kind) {
    const el = document.getElementById('igStatus');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('ok', 'warn');
    if (kind) el.classList.add(kind);
  },

  setPreview(url) {
    const img = document.getElementById('igPreview');
    if (!img) return;
    if (url) {
      img.src = url;
      img.style.visibility = 'visible';
    } else {
      img.removeAttribute('src');
      img.style.visibility = 'hidden';
    }
  },

  setBusy(on) {
    this._busy = !!on;
    ['igShareBtn', 'igDownloadBtn'].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.disabled = !!on;
    });
  },

  syncCounter() {
    const el = document.getElementById('igCaption');
    const counter = document.getElementById('igCaptionCounter');
    if (!counter) return;
    const len = el ? String(el.value || '').length : 0;
    counter.textContent = len + ' / ' + this.MAX_CAPTION;
    counter.classList.toggle('over', len > this.MAX_CAPTION);
  },

  syncActions() {
    const supported = !!(navigator.canShare && typeof window.File !== 'undefined');
    const shareBtn = document.getElementById('igShareBtn');
    if (shareBtn) shareBtn.style.display = supported ? '' : 'none';
    const hint = document.getElementById('igHint');
    if (hint) {
      hint.textContent = supported
        ? 'Toque em Compartilhar…, escolha o Instagram e depois «Seu story». A legenda vai junto.'
        : 'O Instagram não aceita envio direto pelo navegador do computador. Baixe o JPEG, ' +
          'copie a legenda e poste pelo app do celular.';
    }
  },

  async open() {
    const modal = document.getElementById('instagramModal');
    if (!modal) return;
    modal.style.display = 'flex';
    this.revoke();
    this.setPreview(null);
    this.setStatus('Gerando JPEG…', '');
    this.setBusy(true);
    this.syncActions();
    try {
      const meta = await this.prepare();
      this.setPreview(this._url);
      const ok = meta.bytes <= this.MAX_BYTES;
      this.setStatus(
        meta.size.w + ' × ' + meta.size.h + ' JPEG • ' + this.formatBytes(meta.bytes) +
          (ok ? ' • dentro do limite do Instagram' : ' • acima de 8 MB'),
        ok ? 'ok' : 'warn'
      );
    } catch (err) {
      console.error(err);
      this.setStatus('Não foi possível gerar a imagem neste navegador.', 'warn');
    }
    this.setBusy(false);
    const target = document.getElementById('igShareBtn');
    const fallback = document.getElementById('igDownloadBtn');
    const focus = (target && target.style.display !== 'none' ? target : fallback);
    if (focus && focus.focus) focus.focus();
  },

  close() {
    const modal = document.getElementById('instagramModal');
    if (modal) modal.style.display = 'none';
    this.revoke();
    this.setPreview(null);
  },

  init() {
    const caption = document.getElementById('igCaption');
    if (caption) caption.addEventListener('input', () => this.syncCounter());
    this.syncCounter();
    this.syncActions();
  },
};

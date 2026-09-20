import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadScript(name: string): void {
  const src = readFileSync(resolve(__dirname, '../../public/js', name), 'utf8');
  (0, eval)(src);
}

const jpegOf = (bytes: number) => new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });

const canvasOf = (w: number, h: number, blob: Blob) => ({
  width: w,
  height: h,
  toBlob: (cb: (b: Blob) => void) => cb(blob),
});

function stubExport(blob: Blob, w = 1080, h = 1920) {
  window.Export = {
    render: vi.fn(async () => canvasOf(w, h, blob)),
    flatten: vi.fn((c: any) => c),
    backgroundColor: () => '#1f1f1f',
  };
}

function stubObjectUrl() {
  (window.URL as any).createObjectURL = vi.fn(() => 'blob:fake');
  (window.URL as any).revokeObjectURL = vi.fn();
}

function stubCanShare(value: any) {
  Object.defineProperty(window.navigator, 'canShare', {
    value,
    configurable: true,
    writable: true,
  });
}

describe('Instagram (public/js/instagram.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.showToast = vi.fn();
    delete (window as any).State;
    loadScript('instagram.js');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    stubCanShare(undefined);
  });

  describe('targetSize', () => {
    it('usa 9:16 (1080x1920) por padrão', () => {
      expect(window.Instagram.targetSize()).toEqual({ w: 1080, h: 1920 });
    });

    it('usa 1080x1080 quando o canvas está em 1:1', () => {
      expect(window.Instagram.targetSize('1:1')).toEqual({ w: 1080, h: 1080 });
    });

    it('cai no 9:16 para proporções desconhecidas', () => {
      expect(window.Instagram.targetSize('4:5')).toEqual({ w: 1080, h: 1920 });
    });

    it('lê a proporção atual de State', () => {
      window.State = { ratio: '1:1' };
      expect(window.Instagram.targetSize()).toEqual({ w: 1080, h: 1080 });
    });
  });

  describe('formatBytes', () => {
    it('mostra KB abaixo de 1 MB', () => {
      expect(window.Instagram.formatBytes(2048)).toBe('2 KB');
    });

    it('mostra MB com vírgula decimal', () => {
      expect(window.Instagram.formatBytes(1024 * 1024)).toBe('1,0 MB');
      expect(window.Instagram.formatBytes(Math.round(3.5 * 1024 * 1024))).toBe('3,5 MB');
    });

    it('não quebra com valores inválidos', () => {
      expect(window.Instagram.formatBytes(0)).toBe('0 KB');
      expect(window.Instagram.formatBytes(-5)).toBe('0 KB');
    });
  });

  describe('filename', () => {
    it('gera um nome estável com data e hora', () => {
      expect(window.Instagram.filename(new Date(2026, 8, 20, 14, 5)))
        .toBe('story-instagram-2026-09-20_14-05.jpg');
    });
  });

  describe('compress', () => {
    it('não mexe na qualidade quando a imagem já cabe', async () => {
      const calls: number[] = [];
      const { quality } = await window.Instagram.compress(async (q: number) => {
        calls.push(q);
        return jpegOf(1000);
      });
      expect(calls).toEqual([0.92]);
      expect(quality).toBe(0.92);
    });

    it('reduz a qualidade em passos até caber no limite de 8 MB', async () => {
      const sizes: Record<string, number> = {
        '0.92': 9_000_000,
        '0.82': 8_500_000,
        '0.72': 7_000_000,
      };
      const calls: number[] = [];
      const { blob, quality } = await window.Instagram.compress(async (q: number) => {
        calls.push(q);
        return jpegOf(sizes[String(q)] ?? 5_000_000);
      });
      expect(calls).toEqual([0.92, 0.82, 0.72]);
      expect(quality).toBe(0.72);
      expect(blob.size).toBeLessThanOrEqual(window.Instagram.MAX_BYTES);
    });

    it('para em MIN_QUALITY quando nem assim cabe', async () => {
      const { quality } = await window.Instagram.compress(async () => jpegOf(99_000_000));
      expect(quality).toBe(window.Instagram.MIN_QUALITY);
    });
  });

  describe('canShare', () => {
    it('é falso quando a Web Share API não existe', () => {
      stubCanShare(undefined);
      expect(window.Instagram.canShare(new File([], 'a.jpg'))).toBe(false);
    });

    it('é verdadeiro quando o navegador aceita arquivos', () => {
      stubCanShare(() => true);
      expect(window.Instagram.canShare(new File([], 'a.jpg'))).toBe(true);
    });

    it('é falso quando canShare lança', () => {
      stubCanShare(() => { throw new Error('sem permissão'); });
      expect(window.Instagram.canShare(new File([], 'a.jpg'))).toBe(false);
    });
  });

  describe('legenda', () => {
    it('caption lê o textarea e remove espaços nas pontas', () => {
      document.body.innerHTML = '<textarea id="igCaption">  Meu story  </textarea>';
      expect(window.Instagram.caption()).toBe('Meu story');
    });

    it('syncCounter atualiza o contador e marca excesso', () => {
      document.body.innerHTML =
        '<textarea id="igCaption"></textarea><div id="igCaptionCounter"></div>';
      window.Instagram.syncCounter();
      expect(document.getElementById('igCaptionCounter')!.textContent).toBe('0 / 2200');

      const ta = document.getElementById('igCaption') as HTMLTextAreaElement;
      ta.value = 'abc';
      window.Instagram.syncCounter();
      const counter = document.getElementById('igCaptionCounter')!;
      expect(counter.textContent).toBe('3 / 2200');
      expect(counter.classList.contains('over')).toBe(false);
    });
  });

  describe('syncActions', () => {
    it('esconde o botão de compartilhar sem Web Share API', () => {
      document.body.innerHTML = '<button id="igShareBtn"></button><p id="igHint"></p>';
      stubCanShare(undefined);
      window.Instagram.syncActions();
      expect(document.getElementById('igShareBtn')!.style.display).toBe('none');
      expect(document.getElementById('igHint')!.textContent).toContain('computador');
    });

    it('mostra o botão e as instruções no celular', () => {
      document.body.innerHTML = '<button id="igShareBtn"></button><p id="igHint"></p>';
      stubCanShare(() => true);
      window.Instagram.syncActions();
      expect(document.getElementById('igShareBtn')!.style.display).toBe('');
      expect(document.getElementById('igHint')!.textContent).toContain('Seu story');
    });
  });

  describe('open', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<div id="instagramModal" style="display:none;"></div>' +
        '<div id="phone"></div>' +
        '<img id="igPreview" />' +
        '<div id="igStatus"></div>' +
        '<p id="igHint"></p>' +
        '<button id="igShareBtn"></button>' +
        '<button id="igDownloadBtn"></button>';
      stubObjectUrl();
      stubCanShare(() => true);
    });

    it('gera o JPEG, mostra a prévia e informa dimensões e tamanho', async () => {
      stubExport(jpegOf(4200));
      await window.Instagram.open();

      expect(document.getElementById('instagramModal')!.style.display).toBe('flex');
      const status = document.getElementById('igStatus')!.textContent!;
      expect(status).toContain('1080 × 1920');
      expect(status).toContain('4 KB');
      expect(status).toContain('dentro do limite');
      expect(document.getElementById('igPreview')!.getAttribute('src')).toBe('blob:fake');
      expect(document.getElementById('igStatus')!.classList.contains('ok')).toBe(true);
      expect((document.getElementById('igShareBtn') as HTMLButtonElement).disabled).toBe(false);
    });

    it('usa 1080x1080 e avisa quando o canvas está em 1:1 e passa do limite', async () => {
      window.State = { ratio: '1:1' };
      stubExport(jpegOf(9_000_000), 1080, 1080);
      await window.Instagram.open();

      const status = document.getElementById('igStatus')!.textContent!;
      expect(status).toContain('1080 × 1080');
      expect(status).toContain('acima de 8 MB');
      expect(document.getElementById('igStatus')!.classList.contains('warn')).toBe(true);
    });

    it('avisa em vez de quebrar quando a renderização falha', async () => {
      window.Export = { render: vi.fn(async () => { throw new Error('sem html2canvas'); }) };
      await window.Instagram.open();

      expect(document.getElementById('igStatus')!.textContent).toContain('Não foi possível');
      expect((document.getElementById('igShareBtn') as HTMLButtonElement).disabled).toBe(false);
    });

    it('close esconde o modal e limpa a prévia', async () => {
      stubExport(jpegOf(4200));
      await window.Instagram.open();
      window.Instagram.close();

      expect(document.getElementById('instagramModal')!.style.display).toBe('none');
      expect(document.getElementById('igPreview')!.hasAttribute('src')).toBe(false);
      expect(window.Instagram._file).toBeNull();
    });
  });

  describe('download', () => {
    beforeEach(() => {
      document.body.innerHTML = '<textarea id="igCaption">Meu story</textarea>';
      stubObjectUrl();
      window.Instagram._file = new File([jpegOf(4200)], 'story.jpg', { type: 'image/jpeg' });
    });

    it('salva o arquivo e copia a legenda', async () => {
      const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const writeText = vi.fn(async () => {});
      Object.defineProperty(window.navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });

      await window.Instagram.download();

      expect(click).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith('Meu story');
      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('legenda copiada'), 2800, 'success'
      );
    });

    it('ainda salva o arquivo quando a área de transferência é negada', async () => {
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      Object.defineProperty(window.navigator, 'clipboard', {
        value: { writeText: vi.fn(async () => { throw new Error('NotAllowedError'); }) },
        configurable: true,
      });

      await window.Instagram.download();

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('JPEG salvo'), 2800, 'success'
      );
    });
  });

  describe('share', () => {
    it('avisa quando a Web Share API não está disponível', async () => {
      document.body.innerHTML = '<textarea id="igCaption"></textarea>';
      stubCanShare(undefined);
      window.Instagram._file = new File([jpegOf(100)], 'story.jpg', { type: 'image/jpeg' });

      await window.Instagram.share();

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('não é suportado'), 2800, 'warning'
      );
    });

    it('envia arquivo e legenda quando suportado', async () => {
      document.body.innerHTML = '<textarea id="igCaption">Bom dia</textarea>';
      stubCanShare(() => true);
      const share = vi.fn(async (_data: ShareData) => {});
      Object.defineProperty(window.navigator, 'share', { value: share, configurable: true });
      window.Instagram._file = new File([jpegOf(100)], 'story.jpg', { type: 'image/jpeg' });

      await window.Instagram.share();

      expect(share).toHaveBeenCalledTimes(1);
      expect(share.mock.calls[0][0].text).toBe('Bom dia');
      expect(share.mock.calls[0][0].files![0].name).toBe('story.jpg');
    });

    it('ignora o cancelamento do usuário', async () => {
      document.body.innerHTML = '<textarea id="igCaption"></textarea>';
      stubCanShare(() => true);
      const abort = new Error('cancelado');
      abort.name = 'AbortError';
      Object.defineProperty(window.navigator, 'share', {
        value: vi.fn(async () => { throw abort; }),
        configurable: true,
      });
      window.Instagram._file = new File([jpegOf(100)], 'story.jpg', { type: 'image/jpeg' });

      await window.Instagram.share();

      expect(window.showToast).not.toHaveBeenCalled();
    });
  });
});

describe('Export: achatamento do fundo (public/js/export.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    loadScript('export.js');
  });

  it('usa o token do canvas quando o elemento não tem fundo próprio', () => {
    document.body.innerHTML = '<div id="phone"></div>';
    expect(window.Export.backgroundColor()).toBe('#1f1f1f');
  });

  it('devolve o próprio canvas quando não há contexto 2d disponível', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => null as any);
    const canvas = document.createElement('canvas');
    expect(window.Export.flatten(canvas, '#fff')).toBe(canvas);
  });
});

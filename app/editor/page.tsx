"use client";

import { useRef, useState } from "react";
import { Canvas, FabricImage, Rect, IText, filters } from "fabric";

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("vazio");

  function initCanvas() {
    if (canvasRef.current && !canvas) {
      const c = new Canvas(canvasRef.current, {
        width: 540,
        height: 960,
        backgroundColor: "#ffffff",
      });
      setCanvas(c);
    }
  }

  function clearCanvas() {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
  }

  function applyGrid(cols: number) {
    if (!canvas) return;
    clearCanvas();
    const w = canvas.width || 540;
    const h = canvas.height || 960;
    const cellW = w / cols;
    const cellH = h / cols;
    for (let r = 0; r < cols; r++) {
      for (let c = 0; c < cols; c++) {
        const rect = new Rect({
          left: c * cellW + 4,
          top: r * cellH + 4,
          width: cellW - 8,
          height: cellH - 8,
          fill: "#e5e5e5",
          stroke: "#ffffff",
          strokeWidth: 4,
          selectable: false,
          evented: false,
        });
        canvas.add(rect);
      }
    }
    canvas.renderAll();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!canvas || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(url);
    const cw = canvas.width || 540;
    const ch = canvas.height || 960;
    const scale = Math.min((cw * 0.4) / (img.width || 1), (ch * 0.4) / (img.height || 1));
    img.set({
      left: cw / 2,
      top: ch / 2,
      scaleX: scale,
      scaleY: scale,
      originX: "center",
      originY: "center",
    });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  }

  function applyFilterToActive(filterName: string) {
    const active = canvas?.getActiveObject();
    if (!active || !(active instanceof FabricImage)) return;

    active.filters = [];
    switch (filterName) {
      case "quente":
        active.filters.push(
          new filters.Sepia({ amount: 0.35 }),
          new filters.Contrast({ contrast: 0.1 }),
          new filters.Brightness({ brightness: 0.05 })
        );
        break;
      case "frio":
        active.filters.push(
          new filters.HueRotation({ rotation: 0.2 }),
          new filters.Saturation({ saturation: -0.15 }),
          new filters.Brightness({ brightness: 0.05 })
        );
        break;
      case "vintage":
        active.filters.push(
          new filters.Sepia({ amount: 0.5 }),
          new filters.Contrast({ contrast: 0.15 }),
          new filters.Brightness({ brightness: -0.05 })
        );
        break;
      default:
        break;
    }
    active.applyFilters();
    canvas?.renderAll();
  }

  function addText(preset: string) {
    if (!canvas) return;
    const text = new IText(preset, {
      left: 60,
      top: 120,
      fontSize: 28,
      fill: "#3b2417",
      fontFamily: "ui-serif, Georgia, serif",
      width: 420,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-extrabold tracking-tight">my-story-maker</div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCanvas}
              className="px-3 py-2 rounded-lg border border-black/10 bg-white text-sm font-semibold"
            >
              Limpar
            </button>
            <button
              onClick={() => alert("Exportar story em PNG/JPG/WebP.")}
              className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold"
            >
              Exportar story
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
            <div className="px-4 py-3 text-xs uppercase tracking-widest opacity-70">Templates de colagem</div>
            <div className="p-3 grid gap-3">
              {[
                ["vazio", "Vazio", () => clearCanvas()],
                ["2-fotos", "Grade 2x2", () => applyGrid(2)],
                ["3-fotos", "Grade 3x3", () => applyGrid(3)],
              ].map(([key, label, fn]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTemplate(key);
                    fn();
                  }}
                  className={`text-left rounded-xl border border-black/5 bg-gray-50 px-3 py-2 text-sm font-semibold ${
                    selectedTemplate === key ? "ring-2 ring-black" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
            <div className="px-4 py-3 text-xs uppercase tracking-widest opacity-70">
              Pré-visualização no feed
            </div>
            <div className="p-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-rose-100 to-sky-100"
                />
              ))}
            </div>
            <div className="px-4 pb-3 text-xs opacity-70">Clique em uma foto para atualizar o story.</div>
          </section>
        </div>

        <section className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <div className="px-4 py-3 text-xs uppercase tracking-widest opacity-70">Editor de stories</div>
          <div className="p-4 flex flex-col items-center gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-black/5">
              <canvas ref={canvasRef} onMouseDown={initCanvas} />
            </div>

            <div className="w-full">
              <div className="text-sm font-semibold mb-2">Filtros</div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["normal", "Natural"],
                  ["quente", "Quente"],
                  ["frio", "Frio"],
                  ["vintage", "Vintage"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => applyFilterToActive(key)}
                    className="px-3 py-2 rounded-full border border-black/10 bg-white text-sm font-semibold"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="text-sm font-semibold mb-2">Texto</div>
              <div className="flex flex-wrap gap-2">
                {["Título", "Legenda", "#hashtag"].map((text) => (
                  <button
                    key={text}
                    onClick={() => addText(text)}
                    className="px-3 py-2 rounded-full border border-black/10 bg-white text-sm font-semibold"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="text-sm font-semibold mb-2">Imagem</div>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 bg-white text-sm font-semibold cursor-pointer">
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

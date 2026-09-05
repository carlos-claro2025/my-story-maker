# Benchmark & Estratégia — Editores de Stories e Collages

## Contexto

Documento direcionado à concepção do produto **my-story-maker**.  
Ele combina: benchmark direto dos principais concorrentes, análise de versões web, identificação de lacunas de mercado e proposta de MVP com stack técnica sugerida.

---

## 1. Perfis dos Top 3 + Versão Web

### 1.1 Canva
- **Posicionamento:** Melhor solução geral para criação de stories e collages.
- **Destaques:** biblioteca massiva de templates, drag-and-drop, brand kit, colaboração, Magic Resize e exportação multiplataforma.
- **Versão web:** sim, com experiência desktop e mobile.
- **Público-alvo:** criadores, pequenos times e marcas com demanda por volume e consistência visual.
- **Fontes:**
  - [Top 10 Best Collage Maker Software | Ranked for 2026](https://worldmetrics.org/best/collage-maker-software/)
  - [Best Collage Maker Software | Top Picks 2026](https://gitnux.org/best/collage-maker-software/)

### 1.2 Adobe Express
- **Posicionamento:** Melhor custo-benefício para marca e consistência visual.
- **Destaques:** templates variados, animações, integração com Adobe Stock, brand kit, remoção de fundo e redimensionamento rápido.
- **Versão web:** sim.
- **Público-alvo:** equipes e marketers que precisam de produção rápida e padronizada.
- **Fontes:**
  - [Best Collage Making Software | 2026 Rankings](https://zipdo.co/best-collage-making-software/)
  - [Top 10 Best Collage Maker Software | Ranked for 2026](https://worldmetrics.org/best/collage-maker-software/)

### 1.3 Fotor
- **Posicionamento:** Mais acessível para criação rápida.
- **Destaques:** templates para stories, collage com ajustes de borda e espaçamento, edição em um clique e exportação para formato vertical.
- **Versão web:** sim.
- **Público-alvo:** usuários iniciantes e cenários de criação rápida sem software desktop.
- **Fontes:**
  - [Best Collage Maker Software | 2026 Edition](https://wifitalents.com/best/collage-maker-software/)
  - [Top 10 Best Collage Picture Software | Tested in 2026](https://zipdo.co/best-collage-picture-software/)

---

## 2. Matriz Comparativa de Features

| Feature | Canva | Adobe Express | Fotor | Observação para o my-story-maker |
|---|---|---|---|---|
| Templates de stories | Alta variedade | Alta variedade | Média variedade | Diferencial: nicho + templates editáveis |
| Templates de collage | Sim | Sim | Sim | Diferencial: grids inteligentes e recorte automático |
| Drag-and-drop | Sim | Sim | Sim | Esperado como baseline |
| Brand Kit | Sim | Sim | Limitado | Importante para versão paga |
| Colaboração | Sim | Sim | Não | Oportunidade B2B / agências |
| Animações | Sim | Sim | Limitado | Diferencial: animações leves e prévias |
| Exportação vertical | Sim | Sim | Sim | Baseline obrigatória |
| IA assistiva | Sim | Sim | Limitado | Oportunidade: sugestões automáticas de layout |
| Offline / desktop | Sim | Limitado | Não | Oportunidade: versão desktop leve |
| Preço | Freemium | Freemium | Freemium | Validar modelo por uso/assinatura |

---

## 3. Lacunas de Mercado

1. **Falta de foco em nichos específicos**  
   - Maioria das ferramentas é genérica. Nichos como pequenos negócios, criativos de moda, professores e artistas visuais podem demandar fluxos mais direcionados.

2. **Colaboração limitada em ferramentas acessíveis**  
   - Apenas ferramentas enterprise ou caras oferecem colaboração real time com controle de versão.

3. **IA como copiloto de criação, não apenas filtro**  
   - Há espaço para IA que sugira layouts, cores, tipografia e ordenação de mídia com base no contexto do usuário.

4. **Performance em dispositivos mais modestos**  
   - Soluções web existentes tendem a ser pesadas; há espaço para uma experiência mais leve.

5. **Exportação orientada a plataforma**  
   - Muitas ferramentas exportam imagem/vídeo, mas não adaptam metadados, legendas ou prévias de publicação por plataforma.

---

## 4. Feature-set Mínimo (MVP)

### Core
- Criação de collage com até 9 fotos
- Templates de story no formato 9:16
- Drag-and-drop com redimensionamento e rotação
- Ajustes básicos de imagem: brilho, contraste, saturação
- Exportação em PNG/JPG e WebP
- Upload de imagens do dispositivo

### Essencial
- Biblioteca de templates editáveis
- Camadas de texto com fontes variadas
- Aplicação de filtros e bordas
- Histórico local de projetos (autosave)

### Diferencial inicial
- Sugestão automática de layout por IA simples
- Atalhos para redes sociais com specs corretos

---

## 5. Stack Técnica Sugerida

### Frontend
- **Framework:** React com TypeScript
- **Canvas/edição:** Fabric.js ou Konva.js
- **UI:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand ou Jotai
- **Upload/preview:** react-dropzone + compressão local

### Backend
- **API:** Node.js + Fastify ou Next.js API Routes
- **Armazenamento:** S3-compatível ou Cloudflare R2
- **Banco de dados:** PostgreSQL para projetos e usuários
- **Autenticação:** Clerk, Supabase Auth ou Auth.js

### IA e Mídia
- **IA inicial:** heurísticas + modelos leves locais ou API de visão/embedding quando necessário
- **Processamento de imagem:** Canvas API, Sharp ou FFmpeg.wasm
- **Cache de assets:** CDN + service worker para assets pesados

### Deploy e Observabilidade
- **Hospedagem:** Vercel / Netlify / Fly.io
- **Monitoramento:** Sentry + analytics de produto

---

## Notas

- Foco inicial: experiência web rápida, com possível desktop posterior.
- Validar preço por uso/assinatura com base em templates premium, exportação em alta qualidade e colaboração.

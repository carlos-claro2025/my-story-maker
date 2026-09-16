# Security Red Team Analysis — my-story-maker

**Data:** 2026-08-29  
**Escopo:** PRD.md + ADR.md + protótipo `index.html`  
**Objetivo:** identificar falhas, riscos e lacunas de segurança antes do desenvolvimento  

---

## 1. Resumo Executivo

A aplicação **my-story-maker** é um editor de imagens client-side. Pela arquitetura atual, o maior risco não é um servidor hackeado, e sim **vetores de ataque no próprio navegador do usuário e na manipulação de arquivos/entradas**. Abaixo, pontos críticos por severidade.

---

## 2. Vulnerabilidades Críticas / Altas

### 2.1 Upload e Drag-and-Drop sem validação
- **Onde:** PRD Gate 2, ADR-004, `index.html`
- **Risco:** A aplicação aceita upload múltiplo sem restrição de tipo, tamanho ou conteúdo real.
- **Ataques possíveis:**
  - Upload de arquivos maliciosos disfarçados de imagem (SVG com JS, HTML, scripts).
  - Ataque de negação de serviço local por consumo de memória com arquivos gigantes.
  - Exploração de parsing de imagem em bibliotecas futuras (ex.: `html2canvas`, decoders).
- **Recomendação:**
  - Validar MIME type e assinatura de arquivo (magic bytes), não só extensão.
  - Limitar tamanho de upload (ex.: 10 MB por imagem).
  - Rejeitar SVGs ou processá-los em sandbox/sem scripts.
  - Implementar quota por sessão.

### 2.2 Ausência de Content Security Policy (CSP)
- **Onde:** não citado em PRD nem ADR.
- **Risco:** Se houver qualquer injeção de conteúdo externo ou uso de bibliotecas futuras, a falta de CSP permite execução arbitrária de scripts (XSS amplificado).
- **Recomendação:**
  - Definir CSP com `script-src 'self'` e fontes confiáveis para `img-src`, `style-src`, etc.
  - Evitar `unsafe-inline` e `unsafe-eval`.

### 2.3 XSS via conteúdo de texto e elementos
- **Onde:** ADR-001, ADR-008, `index.html`
- **Risco:** A aplicação permite adicionar textos e elementos. Se no futuro esses conteúdos forem salvos, compartilhados ou renderizados sem sanitização, há risco de XSS armazenado/refletido.
- **Recomendação:**
  - Sanitizar entradas de texto antes de inserir no DOM.
  - Não usar `innerHTML` com dados do usuário sem limpeza.
  - Preferir `textContent` ou bibliotecas de sanitização.

### 2.4 Exportação e bibliotecas de terceiros
- **Onde:** ADR-007
- **Risco:** `html2canvas` ou libs similares podem ter vulnerabilidades conhecidas. Sem lock de versão e sem auditoria, você pode introduzir vulnerabilidades.
- **Recomendação:**
  - Fixar versão exata da dependência e auditar CVEs periodicamente.
  - Considerar rodar a geração de export em um Worker ou sandbox.

### 2.5 Imagens externas e Mixed Content / CORS
- **Onde:** PRD Gate 1/2, `index.html`
- **Risco:** Uso de imagens do Unsplash por HTTP/HTTPS misturado pode causar mixed content. Também pode vazar IP via requests a CDNs externos.
- **Recomendação:**
  - Forçar HTTPS em todas as imagens externas.
  - Definir política de privacidade sobre recursos externos.
  - Para exportação, considerar CORS ao usar canvas com imagens externas.

---

## 3. Vulnerabilidades Médias

### 3.1 Estado sensível em memória
- **Onde:** ADR-005
- **Risco:** O estado em memória não é diretamente uma falha, mas se no futuro houver integração com backend ou compartilhamento, dados de imagem e metadados podem vazar.
- **Recomendação:**
  - Definir claramente que nenhum dado sensível é armazenado no MVP.
  - Quando adicionar persistência, implementar autenticação e autorização.

### 3.2 Falta de proteção contra Clickjacking
- **Onde:** não citado em PRD/ADR
- **Risco:** Se a aplicação for hospedada publicamente, pode ser embutida em iframes maliciosas para capturar cliques.
- **Recomendação:**
  - Adicionar header `X-Frame-Options: DENY` ou `SAMEORIGIN`.
  - Implementar frame-ancestors na CSP.

### 3.3 Ausência de logging e monitoramento
- **Onde:** PRD Geral
- **Risco:** Sem logs, incidentes de abuso (uploads massivos, tentativas de exploit) passam despercebidos.
- **Recomendação:**
  - Adicionar logs client-side mínimo (anonimizados) e, no futuro, logs de borda (CDN/WAF).
  - Monitorar erros de parsing de imagem e erros de exportação.

### 3.4 Responsividade e vazamento de informações
- **Onde:** ADR-003, PRD 5.2
- **Risco:** Layout com larguras fixas pode causar overflow e, em cenários futuros com backend, pode revelar estrutura interna.
- **Recomendação:**
  - Garantir que overflow não cause scrollbars estranhos que vazam elementos.
  - Evitar mensagens de erro detalhadas no futuro.

---

## 4. Vulnerabilidades Baixas / Boas Práticas Ausentes

### 4.1 Sem menção a testes de segurança
- **Onde:** PRD
- **Recomendação:**
  - Adicionar testes de sanidade de upload (arquivos válidos/inválidos).
  - Testar exportação com imagens corrompidas.

### 4.2 Sem política de atualização de dependências
- **Onde:** ADR-007
- **Recomendação:**
  - Estabelecer processo de patch contínuo para libs de terceiros.

### 4.3 Sem diretrizes de privacidade
- **Onde:** PRD
- **Recomendação:**
  - Incluir seção de privacidade: dados coletados, armazenamento local, compartilhamento com CDNs.

### 4.4 Sem tratamento de erros seguro
- **Onde:** PRD Gate 5, ADR-007
- **Recomendação:**
  - Evitar stack traces ou detalhes internos em mensagens ao usuário.

---

## 5. Riscos por Gate (revisão direcionada)

| Gate | Riscos principais |
|------|-------------------|
| Gate 1 | CSP ausente; mixed content; clickjacking; XSS por markup futuro |
| Gate 2 | Upload sem validação; DoS por arquivos grandes; parsing malicioso |
| Gate 3 | Baixo risco direto, mas libs futuras podem introduzir CVEs |
| Gate 4 | XSS por texto/elementos; falta de sanitização DOM |
| Gate 5 | Exportação via lib de terceiro sem lock/auditoria; abuso de endpoint se houver backend |

---

## 6. Plano de Mitigação Recomendado (ordem sugerida)

1. **Adicionar seção de segurança no PRD** com requisitos não-funcionais de segurança.
2. **Criar ADR específico para validação de upload** (sanitização, limites, MIME checking).
3. **Criar ADR para CSP e headers de segurança** desde o Gate 1.
4. **Adicionar critério de aceitação de segurança no Gate 2 e Gate 5**.
5. **Definir política de dependências** e lock de versão antes de introduzir `html2canvas`.
6. **Incluir checklist de privacy** no PRD.

---

## 7. Conclusão

O produto é **client-side**, então o superfície de ataque é menor do que uma app com backend. Ainda assim, há riscos concretos:
- uploads maliciosos,
- XSS por conteúdo do usuário,
- dependências inseguras,
- ausência de headers/estratégias de proteção browser.

Recomendo **tratar segurança como requisito desde o Gate 1**, não comosomething para adicionar depois.

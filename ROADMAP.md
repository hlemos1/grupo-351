# ROADMAP DE DESENVOLVIMENTO — GRUPO +351

**Baseado em:** Relatório de Auditoria de 14/03/2026
**Nota inicial:** 7.0/10 | **Meta:** 9.0/10

---

## FASE 1 — CORREÇÕES CRÍTICAS (Concluída)

| # | Item | Status |
|---|------|--------|
| C1 | Padronizar contadores (200+ unidades) entre homepage e /sobre | Feito |
| C2 | Padronizar nome "Forge and Flow 3D" em todo o site | Feito |
| C3 | Remover WhatsApp placeholder (351 000 000 000) — botão só aparece se NEXT_PUBLIC_WHATSAPP_NUMBER estiver configurado | Feito |

---

## FASE 2 — ALTA PRIORIDADE (Concluída)

| # | Item | Status |
|---|------|--------|
| A2 | Corrigir acentuação em todas as páginas públicas (Hero, Sobre, FAQ, Figital, Modelo, ParaQuem, Visao, Localizacao, Numeros, QuemSomos, Parceiros, MarqueeBand) | Feito |
| A3 | Atualizar bio do Henrique Lemos com dados públicos verificados (R$220M+, Rob Food, ABF 5 anos) e remover claim não verificado da Forbes no Fernando | Feito |
| A4 | Corrigir range investimento Barbearia do Rão (10k-10k → 10k-30k EUR) | Feito |
| M4 | Remover link Admin do menu público (mantido apenas no footer discreto) | Feito |
| M5 | Padronizar localização para "Cascais, Portugal" em todo o site | Feito |
| B1 | Adicionar og:image, og:url e twitter:image ao layout metadata | Feito |
| B2 | Criar favicon SVG customizado com logo +351 | Feito |

---

## FASE 3 — MÉDIA PRIORIDADE (Concluída)

| # | Item | Status |
|---|------|--------|
| M1 | Ecossistema: suporte touch/mobile (tap em vez de hover) + mensagem adaptativa | Feito |
| M2 | Completar conteúdo dos 4 artigos em /conhecimento | Feito |
| M3 | Unificar formulário de contato homepage + /contato (mesmo endpoint, mesmos campos) | Feito |
| B3 | Revisar animação typewriter — deleção por palavra, container flexível | Feito |
| B4 | Verificar redirect /admin → /admin/login sem expor nada | Verificado OK |
| -- | OG image 1200x630 via opengraph-image.tsx (edge runtime) | Feito |

---

## FASE 4 — CREDIBILIDADE E CONVERSÃO (Concluída)

| # | Item | Status |
|---|------|--------|
| B5 | Seção de prova social na homepage (métricas + depoimentos) | Feito |
| -- | Links de press (InfoMoney, Exame, Guelt) na bio do Henrique + selo ABF | Feito |
| -- | Página /imprensa com cobertura mediática verificável | Feito |
| -- | Fotos reais dos fundadores (substituir iniciais por avatares) | Pendente (aguarda fotos) |
| -- | Acentuação corrigida na SobrePage inteira | Feito |

---

## FASE 5 — EVOLUÇÃO DO PRODUTO (Concluída parcialmente)

| # | Item | Status |
|---|------|--------|
| -- | Domínio customizado grupo351.com | Pendente (config DNS/Vercel) |
| -- | Configurar NEXT_PUBLIC_WHATSAPP_NUMBER com número real | Pendente (config Vercel) |
| -- | Analytics Umami (RGPD compliant, sem cookies) — componente pronto, ativar via NEXT_PUBLIC_UMAMI_WEBSITE_ID | Feito |
| -- | Email transacional Resend — confirmação ao remetente + notificação admin, ativar via RESEND_API_KEY | Feito |
| -- | Internacionalização (i18n): versão PT-PT + EN | Pendente (16h) |
| -- | Blog/conteúdo dinâmico — edição rica no admin | Pendente (8h) |
| -- | Dashboard de métricas públicas /metricas — projetos, ecossistema, conhecimento | Feito |

---

## FASE 6 — ESCALA E AUTOMAÇÃO (Concluída)

| # | Item | Status |
|---|------|--------|
| -- | Pipeline automático: scoring 0-100, tiers A/B/C/D, flags inteligentes, notificação enriquecida | Feito |
| -- | NDA digital: 9 cláusulas jurídicas, registro IP/timestamp/user-agent, endpoint /api/nda | Feito |
| -- | Portal do parceiro /parceiro?token=xxx: dashboard com métricas JV, meta, histórico | Feito |
| -- | Admin /admin/parceiros: criar parceiros, gerar tokens, copiar links | Feito |
| -- | CRM HubSpot + Pipedrive: sync contatos e deals automático, ativar via env vars | Feito |
| -- | PWA: manifest, service worker, ícones dinâmicos, cache offline, apple-touch-icon | Feito |

---

## MÉTRICAS DE SUCESSO

| Métrica | Atual | Meta Fase 4 | Meta Fase 6 |
|---------|-------|------------|------------|
| Nota auditoria | 7.0 | 8.5 | 9.5 |
| Candidaturas/mês | -- | 10+ | 30+ |
| Taxa conversão /aplicar | -- | 5% | 12% |
| Tempo resposta | 48h | 24h | 4h (auto) |
| Cobertura Schema.org | Completa | Completa | Completa + FAQ rich results |

---

## CONFIGURAÇÃO PENDENTE (Vercel/DNS)

| Item | Variável de ambiente |
|------|---------------------|
| Domínio | Config DNS grupo351.com → Vercel |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Analytics | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` |
| Email | `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `ADMIN_NOTIFICATION_EMAIL` |
| CRM | `CRM_PROVIDER` + `HUBSPOT_API_KEY` ou `PIPEDRIVE_API_TOKEN` |
| Prisma | `npx prisma db push` (novos campos: score, NDA, parceiros) |

---

*Última atualização: 15 de março de 2026*

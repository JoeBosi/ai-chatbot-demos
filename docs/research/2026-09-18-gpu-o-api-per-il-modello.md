# Affittare una GPU per il Barista, oppure pagare a token — 2026-09-18

Domanda di Giuseppe: quale macchina con GPU affittare in cloud per far girare un modello che risponda
bene a questo chatbot, e quanto costa.

## Consumo reale del chatbot (misurato il 2026-09-18)

Una richiesta all'assistente sul sito pubblico: istruzioni di sistema ~3.300 caratteri, risultato di
`searchProducts` ~750 caratteri, risposta ~800 caratteri. Un turno completo fa 2 chiamate al modello:
**≈ 2.500 token in ingresso e 400 in uscita** (di più nelle conversazioni lunghe, il tetto è 40 messaggi).

## Prezzi a token (OpenRouter, letti da `/api/v1/models` il 2026-09-18, $/milione in→out)

| Modello (con strumenti) | in | out | costo per 1.000 messaggi |
|---|---|---|---|
| `mistralai/mistral-small-3.2-24b-instruct` | 0,094 | 0,25 | ~$0,34 |
| `z-ai/glm-5.3-flash` | 0,09 | 0,30 | ~$0,35 |
| `qwen/qwen3.8-flash` | 0,15 | 0,47 | ~$0,56 |
| `openai/gpt-oss-120b` | 0,15 | 0,60 | ~$0,62 |
| `qwen/qwen3.8-27b` | 0,214 | 2,55 | ~$1,55 |

DeepInfra sugli stessi modelli open è più economico di OpenRouter (gpt-oss-120b $0,037/$0,17).

## Prezzi GPU (settembre 2026)

| Fornitore | GPU / VRAM | Prezzo | 24/7 al mese |
|---|---|---|---|
| Hetzner GEX45 (dedicato, DE) | RTX PRO 4000 Blackwell 24 GB | €214/mese + €209 una tantum | €214 |
| Hetzner GEX44 (dedicato, DE) | RTX 4000 SFF Ada 20 GB | €234/mese + €114 | €234 |
| Hetzner GEX131 (dedicato, DE) | RTX PRO 6000 Blackwell 96 GB | €1.199/mese + €599 | €1.199 |
| Contabo | RTX PRO 5000 48 GB · L40S 48 GB | $1,10/GPU/h riservato 1 mese (€1,09/h) | ~$800 |
| Contabo | RTX PRO 6000 96 GB | $2,23/GPU/h riservato | ~$1.630 |
| Contabo | H200 141 GB | $2,93/GPU/h riservato | ~$2.140 |
| RunPod community | A40 48 GB $0,35/h · L40S $0,79/h · RTX PRO 6000 96 GB $1,69/h · H100 PCIe $1,99/h | a ore | $256 / $577 / $1.234 / $1.453 |
| RunPod secure | L40S $1,09/h · RTX PRO 6000 $2,09/h · H100 SXM $3,49/h | a ore | $796 / $1.526 / $2.548 |
| Vast.ai (host community) | RTX 4090 da $0,34/h · A100 80 GB da $0,50/h · H100 da $0,90/h | a ore | $248 / $365 / $657 |
| Scaleway / OVHcloud (EU) | L40S 48 GB | €1,47/h · L40S-90 ~€1.008/mese | ~€1.000+ |

RunPod serverless (scala a zero) esiste, ma il costo attivo è ~65% più alto del pod equivalente e il
caricamento di un modello da 65 GB rende i risvegli lenti: conviene solo a traffico molto irregolare.

## Contabo in dettaglio (stesso fornitore del VPS di Giuseppe)

Listino verificato il 2026-09-18: taglie **48 GB** (RTX PRO 5000 o L40S, 32 vCPU, 234 GB RAM) a
$1,10/GPU/h riservato un mese, **96 GB** (RTX PRO 6000) a $2,23, **141 GB** (H200) a $2,93, fino a 8 GPU.
Nessuna taglia piccola: si parte da 48 GB, cioè da ~€600–800 al mese, contro i €214 del Hetzner GEX45.
Contabo non pubblica prezzi a ore senza impegno e l'attivazione passa da una consulenza commerciale,
quindi non è "accendo e spengo quando serve". Il sito blocca i bot: prezzi presi da elenchi terzi
(getdeploying, hostadvice), da confermare con un preventivo.

## Che modello ci sta dentro (settembre 2026)

- **24 GB** (GEX45, RTX 4090/5090): Mistral Small 24B o Qwen3.8-27B a 4 bit (~15–17 GB) con contesto
  ridotto. 30–60 token/s, 1–3 utenti insieme. Qualità sufficiente per il Barista, sotto i modelli grandi.
- **48 GB** (L40S, A40, A6000): stessa classe di modelli a 8 bit o con contesto lungo, più utenti insieme.
- **96 GB** (RTX PRO 6000 / GEX131): `gpt-oss-120b` in MXFP4 (~65 GB) su una sola scheda, ~120 token/s.
  È il primo livello che risponde davvero come i modelli grandi.
- **80 GB H100**: stessa cosa ma più veloce e più cara.
- Classifica open weight di settembre 2026: Qwen3.8 Max in testa, poi GLM-5.3; per gli strumenti i
  migliori sono Qwen3 e Kimi K2, con GLM e DeepSeek subito dietro.
- Sul VPS attuale (solo CPU) un 27B fa pochi token al secondo: non è una strada.

## Conclusione

Il punto di pareggio fra il GEX45 (€214/mese) e l'API più economica è intorno a **500.000 messaggi al
mese**, ossia ~17.000 al giorno. La demo ne fa qualche decina. Affittare una GPU conviene per altri
motivi: i dati non escono dalle proprie macchine (GDPR), costo fisso e prevedibile, messa a punto del
modello, funzionamento anche senza internet.

## Fonti
- https://openrouter.ai/api/v1/models (prezzi letti direttamente) · https://openrouter.ai/pricing
- https://www.runpod.io/pricing · https://docs.runpod.io/serverless/pricing
- https://www.hetzner.com/dedicated-rootserver/gex45/ · https://dohohub.com/news/hetzner-gex45-entry-level-gpu-server
- https://gpuhosted.com/en/hetzner-gpu-review/ · https://www.hetzner.com/dedicated-rootserver/gex131/
- https://contabo.com/blog/best-gpu-hosting-for-ai-stable-diffusion-in-2026/ · https://www.scaleway.com/en/pricing/gpu/
- https://www.ovhcloud.com/en/public-cloud/gpu/l40s/ · https://www.madebyagents.com/hardware/gpu-rental-prices
- https://www.hardware-corner.net/guides/rtx-pro-6000-gpt-oss-120b-performance/ · https://yingtu.ai/en/blog/gpt-oss-120b-memory-requirements
- https://benchlm.ai/best/open-source · https://www.promptquorum.com/power-local-llm/best-local-models-tool-calling-2026
- https://costbench.com/software/llm-api-providers/deepinfra/
- https://getdeploying.com/contabo · https://getdeploying.com/gpus/nvidia-l40s (listino Contabo: il sito ufficiale blocca i bot)

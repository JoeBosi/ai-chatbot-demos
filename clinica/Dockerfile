# syntax=docker/dockerfile:1
# Crema & Ferro — Next.js standalone + local ONNX embeddings. Debian slim: onnxruntime-node needs glibc.

FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:24-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Clean production tree for the native embedding runtime (standalone tracing misses .so files),
# plus the embedding model baked in so the container never downloads at runtime.
FROM node:24-slim AS embeddings
WORKDIR /rt
RUN npm init -y >/dev/null && npm install --omit=dev --no-audit --no-fund @huggingface/transformers@4.3.0 \
 && rm -rf node_modules/onnxruntime-node/bin/napi-v*/darwin node_modules/onnxruntime-node/bin/napi-v*/win32 \
           node_modules/onnxruntime-node/bin/napi-v*/linux/arm64 \
           node_modules/onnxruntime-node/bin/napi-v*/linux/x64/libonnxruntime_providers_cuda.so \
           node_modules/onnxruntime-node/bin/napi-v*/linux/x64/libonnxruntime_providers_tensorrt.so \
           node_modules/onnxruntime-web
RUN node --input-type=module -e "import { pipeline, env } from '@huggingface/transformers'; env.cacheDir = '/rt/models'; const fe = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', { dtype: 'q8' }); const o = await fe(['query: prova'], { pooling: 'mean', normalize: true }); console.log('embedding dims', o.dims);"

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    EMBEDDINGS_CACHE_DIR=/app/models \
    EMBEDDINGS_OFFLINE=1
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/drizzle ./drizzle
COPY --from=embeddings --chown=node:node /rt/node_modules ./node_modules
COPY --from=embeddings --chown=node:node /rt/models ./models
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]

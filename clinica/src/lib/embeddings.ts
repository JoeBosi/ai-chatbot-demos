import type { FeatureExtractionPipeline } from "@huggingface/transformers";

// Local, CPU-only multilingual embeddings: no API key, no per-request cost.
// e5 models expect "query: " / "passage: " prefixes.
const MODEL = "Xenova/multilingual-e5-small";

let extractor: Promise<FeatureExtractionPipeline> | undefined;

function load() {
  extractor ??= (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.cacheDir = process.env.EMBEDDINGS_CACHE_DIR ?? `${process.cwd()}/.cache/hf`;
    if (process.env.EMBEDDINGS_OFFLINE === "1") env.allowRemoteModels = false;
    return pipeline("feature-extraction", MODEL, { dtype: "q8" });
  })().catch((err) => {
    extractor = undefined;
    throw err;
  });
  return extractor;
}

async function embed(texts: string[]): Promise<number[][]> {
  const fe = await load();
  const out = await fe(texts, { pooling: "mean", normalize: true });
  return out.tolist() as number[][];
}

export async function embedQuery(text: string) {
  const [v] = await embed([`query: ${text.slice(0, 500)}`]);
  return v;
}

export async function embedPassages(texts: string[]) {
  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i += 16) {
    vectors.push(...(await embed(texts.slice(i, i + 16).map((t) => `passage: ${t}`))));
  }
  return vectors;
}

export function warmUpEmbeddings() {
  return load().then(() => undefined);
}

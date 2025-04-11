import type { JobOptions } from "~/jobs";
import { OllamaChatJobBuilder } from "./chat";
import { OllamaEmbeddingJobBuilder } from "./embedding";
import { OllamaModelsJobBuilder } from "./models";

export function ollama(options?: JobOptions) {
  options = options || {};

  return {
    chat(model: string) {
      return new OllamaChatJobBuilder(options, model);
    },
    embedding(model: string) {
      return new OllamaEmbeddingJobBuilder(options, model);
    },
    models() {
      return new OllamaModelsJobBuilder(options);
    },
  };
}

export * from "./chat";
export * from "./embedding";
export * from "./models";
export * from "./schema";

import type { Options } from "~/src/job/schema";
import { EmbeddingBuilder } from "~/src/builder/embedding";
import { runner } from "~/src/job/voyage";

export function voyage(options?: Options) {
  return {
    embedding(model: string) {
      return new EmbeddingBuilder("voyage" as const, options, runner, model);
    },
  };
}

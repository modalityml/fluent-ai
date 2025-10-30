import type { Job } from "~/src/job/schema";
import { EmbeddingBuilder } from "./embedding";
import { runner } from "~/src/job/voyage";

type Options = Extract<Job, { provider: "voyage" }>["options"];

export function voyage(options?: Options) {
  return {
    embedding(model: string) {
      return new EmbeddingBuilder("voyage" as const, options, runner, model);
    },
  };
}

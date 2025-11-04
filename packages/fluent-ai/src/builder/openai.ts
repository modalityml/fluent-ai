import type { Options } from "~/src/job/schema";
import { ChatBuilder } from "~/src/builder/chat";
import { ModelsBuilder } from "~/src/builder/models";
import { runner } from "~/src/job/openai";

export function openai(options?: Options) {
  return {
    chat(model: string) {
      return new ChatBuilder("openai" as const, options, runner, model);
    },
    models() {
      return new ModelsBuilder("openai" as const, options, runner);
    },
  };
}

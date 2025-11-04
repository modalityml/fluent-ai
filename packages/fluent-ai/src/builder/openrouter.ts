import type { Options } from "~/src/job/schema";
import { ChatBuilder } from "~/src/builder/chat";
import { runner } from "~/src/job/openrouter";

export function openrouter(options?: Options) {
  return {
    chat(model: string) {
      return new ChatBuilder("openrouter" as const, options, runner, model);
    },
  };
}

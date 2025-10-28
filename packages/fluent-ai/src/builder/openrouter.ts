import type { Job } from "~/src/job/schema";
import { ChatBuilder } from "./chat";
import { runner } from "~/src/job/openrouter";

type Options = Extract<Job, { provider: "openrouter" }>["options"];

export function openrouter(options?: Options) {
  return {
    chat(model: string) {
      return new ChatBuilder("openrouter" as const, options, runner, model);
    },
  };
}

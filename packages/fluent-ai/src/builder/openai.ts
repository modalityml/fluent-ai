import type { Job } from "~/src/job/schema";
import { ChatBuilder } from "./chat";
import { ModelsBuilder } from "./models";
import { runner } from "~/src/job/openai";

type Options = Extract<Job, { provider: "openai" }>["options"];

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

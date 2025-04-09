import type { JobOptions } from "~/jobs";
import { FalImageJobBuilder } from "./image";

export function fal(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FAL_API_KEY;

  return {
    image(model: string) {
      return new FalImageJobBuilder(options, model);
    },
  };
}

export * from "./image";
export * from "./schema";

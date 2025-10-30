import type { Job } from "~/src/job/schema";
import { ImageBuilder } from "./image";
import { runner } from "~/src/job/fal";

type Options = Extract<Job, { provider: "fal" }>["options"];

export function fal(options?: Options) {
  return {
    image(model: string) {
      return new ImageBuilder("fal" as const, options, runner, model);
    },
  };
}

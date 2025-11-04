import type { Options } from "~/src/job/schema";
import { ImageBuilder } from "~/src/builder/image";
import { runner } from "~/src/job/fal";

export function fal(options?: Options) {
  return {
    image(model: string) {
      return new ImageBuilder("fal" as const, options, runner, model);
    },
  };
}

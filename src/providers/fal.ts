import { z } from "zod";
import { ImageJob, ImageJobSchema } from "../jobs/image";
import type { JobOptionsType } from "../jobs/schema";

export type FalImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
};

export const BaseFalJobSchema = z.object({
  provider: z.literal("fal"),
});

export const FalImageJobSchema = ImageJobSchema.merge(BaseFalJobSchema);
export type FalImageJobSchemaType = z.infer<typeof FalImageJobSchema>;

export const FalJobSchema = z.discriminatedUnion("type", [FalImageJobSchema]);
export type FalJobSchemaType = z.infer<typeof FalJobSchema>;

export class FalImageJob extends ImageJob<FalImageJobSchemaType> {
  constructor(options: JobOptionsType, model: string) {
    super(model);
    this.provider = "fal";
    this.options = options;
    this.model = model;
    this.params = {};
  }

  makeRequest = () => {
    return new Request(`https://queue.fal.run/${this.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: this.params.prompt,
        image_size: this.params.size,
        num_inference_steps: this.params.numInferenceSteps,
        seed: this.params.seed,
        guidance_scale: this.params.guidanceScale,
        sync_mode: this.params.syncMode,
        num_images: this.params.n,
        enable_safety_checker: this.params.enableSafetyChecker,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      provider: "fal" as const,
    };
  }
}

export function fal(options?: JobOptionsType) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FAL_API_KEY;

  return {
    image(model: string) {
      return new FalImageJob(options, model);
    },
  };
}

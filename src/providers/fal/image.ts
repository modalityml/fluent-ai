import type { JobOptions } from "~/jobs/schema";
import { ImageJobBuilder } from "~/jobs/image";
import type { FalImageJob } from "./schema";

export class FalImageJobBuilder extends ImageJobBuilder<FalImageJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "fal";
    this.options = options;
  }

  makeRequest = () => {
    return new Request(`https://queue.fal.run/${this.input.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: this.input.prompt,
        image_size: this.input.size,
        num_inference_steps: this.input.numInferenceSteps,
        seed: this.input.seed,
        guidance_scale: this.input.guidanceScale,
        sync_mode: this.input.syncMode,
        num_images: this.input.n,
        enable_safety_checker: this.input.enableSafetyChecker,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}

import { ImageJobBuilder } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";

export class FalImageJob extends ImageJobBuilder<FalImageJobSchemaType> {
  constructor(options: JobOptions, model: string) {
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

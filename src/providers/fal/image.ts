import { ImageJobBuilder } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";

export class FalImageJobBuilder extends ImageJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "fal";
    this.options = options;
  }

  makeRequest = () => {
    return new Request(`https://queue.fal.run/${this.job.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: this.job.prompt,
        image_size: this.job.size,
        num_inference_steps: this.job.numInferenceSteps,
        seed: this.job.seed,
        guidance_scale: this.job.guidanceScale,
        sync_mode: this.job.syncMode,
        num_images: this.job.n,
        enable_safety_checker: this.job.enableSafetyChecker,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}

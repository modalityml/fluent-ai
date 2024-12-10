import { ImageJob } from "../jobs/image";
import type { AIProviderOptions } from "../jobs/job";

export function fal(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FAL_API_KEY;

  return {
    image(model: string) {
      return new FalImageJob(options, model);
    },
  };
}

export type FalImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
};

export class FalImageJob extends ImageJob {
  constructor(options: AIProviderOptions, model: string) {
    super();
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
}

import { ImageJob } from "../jobs/image";

interface ProviderOptions {
  apiKey?: string;
}

export function fal(options?: ProviderOptions) {
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
  options: ProviderOptions;
  model: string;

  constructor(options: ProviderOptions, model: string) {
    super();
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

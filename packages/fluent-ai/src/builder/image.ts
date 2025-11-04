import type { ImageJob } from "~/src/job/schema";

export class ImageBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;
  private input: Partial<ImageJob["input"]> & { model: string } = {
    model: "",
    prompt: "",
  };

  constructor(provider: TProvider, options: any, runner: any, model: string) {
    this.provider = provider;
    this.options = options;
    this.runner = runner;
    this.input.model = model;
  }

  prompt(prompt: string) {
    this.input.prompt = prompt;
    return this;
  }

  size(size: { width: number; height: number }) {
    this.input.size = size;
    return this;
  }

  n(n: number) {
    this.input.n = n;
    return this;
  }

  num(n: number) {
    return this.n(n);
  }

  download(options: ImageJob["input"]["download"]) {
    this.input.download = options;
    return this;
  }

  build() {
    return {
      type: "image" as const,
      provider: this.provider,
      options: this.options,
      input: this.input as ImageJob["input"],
    };
  }

  run() {
    const job = this.build();
    return this.runner.image(job.input, job.options);
  }
}

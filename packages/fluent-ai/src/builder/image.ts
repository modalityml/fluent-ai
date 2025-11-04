import type { Job } from "~/src/job/schema";

type ImageInput = Extract<
  Extract<Job, { provider: "fal" }>["body"],
  { type: "image" }
>["input"];
type DownloadInput = ImageInput["download"];

export class ImageBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;
  private input: Partial<ImageInput> & { model: string } = {
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

  download(options: DownloadInput) {
    this.input.download = options;
    return this;
  }

  build() {
    return {
      provider: this.provider,
      options: this.options,
      body: {
        type: "image" as const,
        input: this.input as ImageInput,
      },
    };
  }

  run() {
    const job = this.build();
    return this.runner.image(job.body.input, job.options);
  }
}

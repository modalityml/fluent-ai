import type { Job } from "~/src/job/schema";

type EmbeddingInput = Extract<
  Extract<Job, { provider: "voyage" }>["body"],
  { type: "embedding" }
>["input"];

export class EmbeddingBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;
  private inputData: EmbeddingInput = { model: "", input: "" };

  constructor(provider: TProvider, options: any, runner: any, model: string) {
    this.provider = provider;
    this.options = options;
    this.runner = runner;
    this.inputData.model = model;
  }

  input(input: string | string[]): this {
    this.inputData.input = input;
    return this;
  }

  build() {
    return {
      provider: this.provider,
      options: this.options,
      body: {
        type: "embedding" as const,
        input: this.inputData,
      },
    };
  }

  run() {
    const job = this.build();
    return this.runner.embedding(job.body.input, job.options);
  }
}

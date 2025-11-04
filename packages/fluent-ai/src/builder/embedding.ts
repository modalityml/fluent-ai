import type { EmbeddingJob } from "~/src/job/schema";

export class EmbeddingBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;
  private inputData: EmbeddingJob["input"] = { model: "", input: "" };

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
      type: "embedding" as const,
      provider: this.provider,
      options: this.options,
      input: this.inputData,
    };
  }

  run() {
    const job = this.build();
    return this.runner.embedding(job.input, job.options);
  }
}

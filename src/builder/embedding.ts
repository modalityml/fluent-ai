import type { Job, Options, ProviderName } from "~/src/job/schema";
import { run } from "~/src/job/registry";

export interface EmbeddingBuilder {
  model(model: string): this;
  input(input: string | string[]): this;
  build(): Job;
  run(): Promise<any>;
}

export class BaseEmbeddingBuilder implements EmbeddingBuilder {
  private _model?: string;
  private _input?: string | string[];

  constructor(
    private provider: ProviderName,
    private options?: Options,
    private version?: string,
  ) {}

  model(model: string): this {
    this._model = model;
    return this;
  }

  input(input: string | string[]): this {
    this._input = input;
    return this;
  }

  build(): Job {
    if (!this._model || !this._input) {
      throw new Error("Model and input are required");
    }

    return {
      provider: this.provider,
      version: this.version,
      options: this.options,
      body: {
        type: "embedding",
        input: {
          model: this._model,
          input: this._input,
        },
      },
    } as Job;
  }

  async run(): Promise<any> {
    return run(this.build());
  }
}

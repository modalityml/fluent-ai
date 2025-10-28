import type { Job, Options, ProviderName } from "~/src/job/schema";
import { run } from "~/src/job/registry";

export interface ImageBuilder {
  model(model: string): this;
  prompt(prompt: string): this;
  size(size: string): this;
  n(count: number): this;
  build(): Job;
  run(): Promise<any>;
}

export class BaseImageBuilder implements ImageBuilder {
  private _model?: string;
  private _prompt?: string;
  private _size?: string;
  private _n?: number;

  constructor(
    private provider: ProviderName,
    private options?: Options,
    private version?: string,
  ) {}

  model(model: string): this {
    this._model = model;
    return this;
  }

  prompt(prompt: string): this {
    this._prompt = prompt;
    return this;
  }

  size(size: string): this {
    this._size = size;
    return this;
  }

  n(count: number): this {
    this._n = count;
    return this;
  }

  build(): Job {
    if (!this._model || !this._prompt) {
      throw new Error("Model and prompt are required");
    }

    return {
      provider: this.provider,
      version: this.version,
      options: this.options,
      body: {
        type: "image",
        input: {
          model: this._model,
          prompt: this._prompt,
          size: this._size,
          n: this._n,
        },
      },
    } as Job;
  }

  async run(): Promise<any> {
    return run(this.build());
  }
}

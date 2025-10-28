import type { Job, Options, ProviderName } from "~/src/job/schema";
import { run } from "~/src/job/registry";

export interface SpeechBuilder {
  model(model: string): this;
  input(text: string): this;
  voice(voice: string): this;
  build(): Job;
  run(): Promise<any>;
}

export class BaseSpeechBuilder implements SpeechBuilder {
  private _model?: string;
  private _input?: string;
  private _voice?: string;

  constructor(
    private provider: ProviderName,
    private options?: Options,
    private version?: string,
  ) {}

  model(model: string): this {
    this._model = model;
    return this;
  }

  input(text: string): this {
    this._input = text;
    return this;
  }

  voice(voice: string): this {
    this._voice = voice;
    return this;
  }

  build(): Job {
    if (!this._model || !this._input || !this._voice) {
      throw new Error("Model, input, and voice are required");
    }

    return {
      provider: this.provider,
      version: this.version,
      options: this.options,
      body: {
        type: "speech",
        input: {
          model: this._model,
          input: this._input,
          voice: this._voice,
        },
      },
    } as Job;
  }

  async run(): Promise<any> {
    return run(this.build());
  }
}

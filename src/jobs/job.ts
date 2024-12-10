export type AIJobProvider =
  | "anthropic"
  | "fal"
  | "fireworks"
  | "google"
  | "ollama"
  | "openai"
  | "perplexity"
  | "voyageai";

export interface AIJob {
  provider: AIJobProvider;
  options?: any;
  chat?: any;
  embedding?: any;
  image?: any;
}

export interface AIProviderOptions {
  apiKey?: string;
  baseURL?: string;
}

export class Job {
  provider!: AIJobProvider;
  options!: AIProviderOptions;
  model!: string;
  params: any;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  _setParams(params: any) {
    this.params = { ...this.params, ...params };
    return this;
  }

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    return await this.handleResponse!(response);
  }

  dump(): AIJob {
    return {
      provider: this.provider!,
      options: this.options,
    };
  }
}

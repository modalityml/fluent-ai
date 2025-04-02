import { ChatJob, convertMessages } from "../jobs/chat";
import { EmbeddingJob } from "../jobs/embedding";
import type { AIProviderOptions } from "../jobs/job";

export function ollama(options?: AIProviderOptions) {
  options = options || {};

  return {
    chat(model: string) {
      return new OllamaChatJob(options, model);
    },
    embedding(model: string) {
      return new OllamaEmbeddingJob(options, model);
    },
  };
}

export class OllamaChatJob extends ChatJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model: this.model,
        messages: convertMessages(this.params.messages),
        tools: this.params.tools?.map((tool) => tool.toJSON()),
        stream: false,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

export class OllamaEmbeddingJob extends EmbeddingJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/embed", {
      method: "POST",
      body: JSON.stringify({
        model: this.model,
        input: this.params.input,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

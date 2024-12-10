import { ChatJob, convertMessages } from "../jobs/chat";
import { EmbeddingJob } from "../jobs/embedding";

export function ollama() {
  return {
    chat(model: string) {
      return new OllamaChatJob(model);
    },
    embedding(model: string) {
      return new OllamaEmbeddingJob(model);
    },
  };
}

export class OllamaChatJob extends ChatJob {
  model: string;

  constructor(model: string) {
    super();
    this.model = model;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model: this.model,
        messages: convertMessages(this.params.messages),
        tools: this.params.tools,
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
  model: string;

  constructor(model: string) {
    super();
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

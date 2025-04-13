import {
  ChatJobBuilder,
  convertMessages,
  convertTools,
  type JobOptions,
} from "~/jobs";

export class OllamaChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model: this.job.model,
        messages: convertMessages(this.job.messages),
        tools: convertTools(this.job.tools),
        stream: false,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

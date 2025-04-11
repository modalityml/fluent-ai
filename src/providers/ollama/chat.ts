import { ChatJobBuilder, convertMessages, type JobOptions } from "~/jobs";

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
        tools: this.job.tools?.map((tool) => tool.toJSON?.()),
        stream: false,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

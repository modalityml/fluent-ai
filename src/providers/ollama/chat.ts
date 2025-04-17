import { ChatJobBuilder, convertMessages, convertTools } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";

export class OllamaChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    const requestBody = {
      model: this.job.model,
      messages: convertMessages(this.job.messages),
      stream: false,
    } as any;

    if (this.job.tools && this.job.tools.length) {
      requestBody.tools = convertTools(this.job.tools);
    }

    return new Request("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

import { ChatJobBuilder, convertMessages } from "~/jobs/chat";
import { type JobOptions } from "~/jobs/schema";

export class OllamaChatJob extends ChatJobBuilder<OllamaChatJobSchemaType> {
  constructor(options: JobOptions, model: string) {
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
        tools: this.params.tools?.map((tool) => tool.toJSON?.()),
        stream: false,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

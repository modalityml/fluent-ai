import { ChatJobBuilder, convertMessages, type JobOptions } from "~/jobs";

export class GoogleChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "google";
    this.options = options;
  }

  makeRequest = () => {
    return new Request(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.job.model}:generateContent?key=${this.options.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: convertMessages(this.job.messages).map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      }
    );
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

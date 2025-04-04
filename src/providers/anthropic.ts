import { ChatJob, ChatJobSchema, convertMessages } from "../jobs/chat";
import { ListModelsJob, ModelsJobSchema } from "../jobs/models";
import { type ProviderOptionsType } from "../jobs/schema";
import { z } from "zod";

export const BaseAnthropicJobSchema = z.object({
  provider: z.literal("anthropic"),
});

export const AnthropicChatJobSchema = ChatJobSchema.merge(
  BaseAnthropicJobSchema
);
export type AnthropicChatJobSchemaType = z.infer<typeof AnthropicChatJobSchema>;
export const AnthropicListModelsJobSchema = ModelsJobSchema.merge(
  BaseAnthropicJobSchema
);
export type AnthropicListModelsJobSchemaType = z.infer<
  typeof AnthropicListModelsJobSchema
>;
export const AnthropicJobSchema = z.discriminatedUnion("type", [
  AnthropicChatJobSchema,
  AnthropicListModelsJobSchema,
]);
export type AnthropicJobSchemaType = z.infer<typeof AnthropicJobSchema>;

export function anthropic(options?: ProviderOptionsType) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  return {
    chat(model: string) {
      return new AnthropicChatJob(options, model);
    },
    models() {
      return new AnthropicListModelsJob(options);
    },
  };
}

export class AnthropicChatJob extends ChatJob<AnthropicChatJobSchemaType> {
  constructor(options: ProviderOptionsType, model: string) {
    super(model);
    this.provider = "anthropic";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    const requestParams = {
      model: this.model,
      max_tokens: this.params.maxTokens,
      messages: convertMessages(this.params.messages),
    } as any;

    if (this.params.tools && this.params.tools.length) {
      requestParams.tools = this.params.tools.map((tool) => tool.toJSON?.());
      requestParams.tool_choice = this.params.toolChoice;
    }

    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    };

    return new Request("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestParams),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };

  dump() {
    const obj = super.dump();
    return {
      ...obj,
    };
  }
}

export class AnthropicListModelsJob extends ListModelsJob<AnthropicListModelsJobSchemaType> {
  constructor(options: ProviderOptionsType) {
    super();
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest = () => {
    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    };

    return new Request("https://api.anthropic.com/v1/models", {
      method: "GET",
      headers: headers,
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

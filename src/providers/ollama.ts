import { ChatJob, ChatJobSchema, convertMessages } from "../jobs/chat";
import { ListModelsJob, ModelsJobSchema } from "../jobs/models";
import { EmbeddingJob, EmbeddingJobSchema } from "../jobs/embedding";
import { type ProviderOptionsType } from "../jobs/schema";
import { z } from "zod";

export const BaseOllamaJobSchema = z.object({
  provider: z.literal("ollama"),
});

export const OllamaChatJobSchema = ChatJobSchema.merge(BaseOllamaJobSchema);
export type OllamaChatJobSchemaType = z.infer<typeof OllamaChatJobSchema>;

export const OllamaEmbeddingJobSchema = EmbeddingJobSchema.merge(
  BaseOllamaJobSchema
);
export type OllamaEmbeddingJobSchemaType = z.infer<typeof OllamaEmbeddingJobSchema>;

export const OllamaListModelsJobSchema = ModelsJobSchema.merge(
  BaseOllamaJobSchema
);
export type OllamaListModelsJobSchemaType = z.infer<
  typeof OllamaListModelsJobSchema
>;

export const OllamaJobSchema = z.discriminatedUnion("type", [
  OllamaChatJobSchema,
  OllamaEmbeddingJobSchema,
  OllamaListModelsJobSchema,
]);
export type OllamaJobSchemaType = z.infer<typeof OllamaJobSchema>;

export function ollama(options?: ProviderOptionsType) {
  options = options || {};

  return {
    chat(model: string) {
      return new OllamaChatJob(options, model);
    },
    embedding(model: string) {
      return new OllamaEmbeddingJob(options, model);
    },
    models() {
      return new OllamaListModelsJob(options);
    },
  };
}

export class OllamaChatJob extends ChatJob<OllamaChatJobSchemaType> {
  constructor(options: ProviderOptionsType, model: string) {
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

export class OllamaListModelsJob extends ListModelsJob<OllamaListModelsJobSchemaType> {
  constructor(options: ProviderOptionsType) {
    super();
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/tags", { method: "GET" });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

export class OllamaEmbeddingJob extends EmbeddingJob<OllamaEmbeddingJobSchemaType> {
  constructor(options: ProviderOptionsType, model: string) {
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

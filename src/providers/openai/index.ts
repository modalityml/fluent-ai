import { type JobOptions } from "~/jobs/schema";
import { OpenAIChatJobBuilder } from "~/providers/openai/chat";
import { OpenAIImageJobBuilder } from "~/providers/openai/image";
import { OpenAIEmbeddingJobBuilder } from "~/providers/openai/embedding";
import { OpenAIModelsJobBuilder } from "~/providers/openai/models";
import { OpenAISpeechJobBuilder } from "~/providers/openai/speech";

export function openai(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.OPENAI_API_KEY;

  return {
    chat(model: string) {
      return new OpenAIChatJobBuilder(options, model);
    },
    image(model: string) {
      return new OpenAIImageJobBuilder(options, model);
    },
    embedding(model: string) {
      return new OpenAIEmbeddingJobBuilder(options, model);
    },
    models() {
      return new OpenAIModelsJobBuilder(options);
    },
    speech(model: string) {
      return new OpenAISpeechJobBuilder(options, model);
    },
  };
}

export * from "./chat";
export * from "./image";
export * from "./embedding";
export * from "./schema";

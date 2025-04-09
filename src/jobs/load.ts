import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { openai, OpenAIJobSchema } from "~/providers/openai";
import { anthropic, AnthropicJobSchema } from "~/providers/anthropic";
import { fal, FalJobSchema } from "~/providers/fal";
import { ollama, OllamaJobSchema } from "~/providers/ollama";
import { voyage, VoyageJobSchema } from "~/providers/voyage";

export const JobSchema = z.union([
  ...AnthropicJobSchema.options,
  ...FalJobSchema.options,
  ...OllamaJobSchema.options,
  ...OpenAIJobSchema.options,
  ...VoyageJobSchema.options,
]);

export type Job = z.infer<typeof JobSchema>;

export const jobJsonSchema = zodToJsonSchema(JobSchema);

export function load(obj: Job) {
  obj = JobSchema.parse(obj);

  let provider = null;
  if (obj.provider === "anthropic") {
    provider = anthropic(obj.options);
  } else if (obj.provider === "fal") {
    provider = fal(obj.options);
  } else if (obj.provider === "ollama") {
    provider = ollama();
  } else if (obj.provider === "openai") {
    provider = openai(obj.options);
  } else if (obj.provider === "voyage") {
    provider = voyage(obj.options);
  }

  if (!provider) {
    throw new Error("Unknown provider " + obj.provider);
  }

  let builder = null;

  if (obj.type === "chat" && "chat" in provider) {
    builder = provider.chat(obj.model);
  }
  if (obj.type === "embedding" && "embedding" in provider) {
    builder = provider.embedding(obj.model);
  }
  if (obj.type === "image" && "image" in provider) {
    builder = provider.image(obj.model);
  }
  if (obj.type === "models" && "models" in provider) {
    builder = provider.models();
  }

  if (!builder) {
    throw new Error("Failed to load job");
  }

  builder.job = obj;

  return builder;
}

import { z } from "zod";
import { anthropic, AnthropicJobSchema } from "~/providers/anthropic";
import { deepseek, DeepseekJobSchema } from "~/providers/deepseek";
import { fal, FalJobSchema } from "~/providers/fal";
import { GoogleJobSchema } from "~/providers/google";
import { LumaJobSchema } from "~/providers/luma";
import { ollama, OllamaJobSchema } from "~/providers/ollama";
import { openai, OpenAIJobSchema } from "~/providers/openai";
import { voyage, VoyageJobSchema } from "~/providers/voyage";

export const JobSchema = z.union([
  AnthropicJobSchema,
  DeepseekJobSchema,
  FalJobSchema,
  GoogleJobSchema,
  LumaJobSchema,
  OllamaJobSchema,
  OpenAIJobSchema,
  VoyageJobSchema,
]);

export type Job = z.infer<typeof JobSchema>;

export const jobJSONSchema = z.toJSONSchema(JobSchema);

export function load(obj: Job) {
  obj = JobSchema.parse(obj);

  let provider = null;
  if (obj.provider === "anthropic") {
    provider = anthropic(obj.options);
  } else if (obj.provider === "deepseek") {
    provider = deepseek(obj.options);
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
    builder = provider.chat(obj.input.model);
  }
  if (obj.type === "embedding" && "embedding" in provider) {
    builder = provider.embedding(obj.input.model);
  }
  if (obj.type === "image" && "image" in provider) {
    builder = provider.image(obj.input.model);
  }
  if (obj.type === "models" && "models" in provider) {
    builder = provider.models();
  }

  if (!builder) {
    throw new Error("Failed to load job");
  }

  builder.input = obj.input;

  return builder;
}

import { type Job } from "./job";
import { openai, OpenaiJobSchema } from "../providers/openai";
import { anthropic, AnthropicJobSchema } from "../providers/anthropic";
import { fal, FalJobSchema } from "../providers/fal";
import { ollama, OllamaJobSchema } from "../providers/ollama";
import { voyageai, VoyageaiJobSchema } from "../providers/voyageai";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const JobSchema = z.union([
  ...AnthropicJobSchema.options,
  ...FalJobSchema.options,
  ...OllamaJobSchema.options,
  ...OpenaiJobSchema.options,
  ...VoyageaiJobSchema.options,
]);

export type JobType = z.infer<typeof JobSchema>;

export const jobJsonSchema = zodToJsonSchema(JobSchema);

export function load(obj: JobType): Job<JobType> {
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
  } else if (obj.provider === "voyageai") {
    provider = voyageai(obj.options);
  }

  if (!provider) {
    throw new Error("Unknown provider " + obj.provider);
  }

  if (obj.type === "chat" && "chat" in provider) {
    return provider.chat(obj.model)._setParams(obj.params);
  }
  if (obj.type === "embedding" && "embedding" in provider) {
    return provider.embedding(obj.model)._setParams(obj.params);
  }
  if (obj.type === "image" && "image" in provider) {
    return provider.image(obj.model)._setParams(obj.params);
  }
  if (obj.type === "models" && "models" in provider) {
    return provider.models();
  }

  throw new Error("Failed to load job");
}

import { z } from "zod";

export const JobProviderSchema = z.enum([
  "anthropic",
  "fal",
  "ollama",
  "openai",
  "voyageai",
  "together",
  "fireworks",
  "luma",
  "google",
]);

export const JobTypeSchema = z.enum(["chat", "image", "models", "embedding"]);

export const JobOptionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

export const BaseJobSchema = z.object({
  version: z.string().optional(),
  options: JobOptionsSchema.optional(),
});

export type JobProviderType = z.infer<typeof JobProviderSchema>;
export type JobTypeType = z.infer<typeof JobTypeSchema>;
export type BaseJob = z.infer<typeof BaseJobSchema>;
export type JobOptions = z.infer<typeof JobOptionsSchema>;

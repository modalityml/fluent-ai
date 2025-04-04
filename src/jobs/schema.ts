import { z } from "zod";


export const ProviderSchema = z.enum([
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

export const OptionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

export const BaseJobSchema = z.object({
  version: z.string().optional(),
  options: OptionsSchema.optional(),
});
export type BaseJobSchemaType = z.infer<typeof BaseJobSchema>;


export type ProviderOptionsType = z.infer<typeof OptionsSchema>;

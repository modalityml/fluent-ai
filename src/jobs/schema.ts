import { z } from "zod";

export const JobProviderSchema = z.enum([
  "anthropic",
  "deepseek",
  "fal",
  "google",
  "luma",
  "ollama",
  "openai",
  "voyage",
]);

export const JobTypeSchema = z.enum(["chat", "image", "models", "embedding"]);

export const JobOptionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

export const JobCostSchema = z.object({
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

export const JobPerformance = z.object({});

export type JobCost = z.infer<typeof JobCostSchema>;

export type JobPerformance = z.infer<typeof JobPerformance>;

export const BaseJobSchema = z.object({
  version: z.string().optional(),
  provider: JobProviderSchema,
  options: JobOptionsSchema.optional(),
  cost: JobCostSchema.optional(),
  type: JobTypeSchema,
  input: z.any(),
  output: z.any().optional(),
  performance: JobPerformance.optional(),
});

export type JobProvider = z.infer<typeof JobProviderSchema>;
export type JobType = z.infer<typeof JobTypeSchema>;
export type BaseJob = z.infer<typeof BaseJobSchema>;
export type JobOptions = z.infer<typeof JobOptionsSchema>;

import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const ImageSizeSchema = z.union([
  z.literal("square_hd"),
  z.literal("square"),
  z.literal("portrait_4_3"),
  z.literal("portrait_16_9"),
  z.literal("landscape_4_3"),
  z.literal("landscape_16_9"),
  z.object({
    width: z.number(),
    height: z.number(),
  }),
]);

export type ImageSize = z.infer<typeof ImageSizeSchema>;

const ImageResultSchema = z.object({
  images: z.array(
    z.union([
      z.object({
        url: z.string(),
      }),
      z.object({
        base64: z.string(),
      }),
    ])
  ),
  metadata: z
    .object({
      prompt: z.string(),
      size: ImageSizeSchema,
      seed: z.number().optional(),
    })
    .optional(),
});

export const ImageJobSchema = BaseJobSchema.extend({
  type: z.literal("image"),
  model: z.string(),

  prompt: z.string().optional(),
  n: z.number().optional(),
  quality: z.string().optional(),
  responseFormat: z.string().optional(),
  size: ImageSizeSchema.optional(),
  style: z.string().optional(),
  user: z.string().optional(),
  numInferenceSteps: z.number().optional(),
  seed: z.number().optional(),
  guidanceScale: z.number().optional(),
  syncMode: z.boolean().optional(),
  enableSafetyChecker: z.boolean().optional(),
  stream: z.boolean().optional(),

  result: ImageResultSchema.optional(),
});

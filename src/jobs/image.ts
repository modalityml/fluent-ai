import { z } from "zod";
import { BaseJobSchema } from "./schema";
import { Job } from "./job";

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

export const ImageJobParamsSchema = z.object({
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
});

export type ImageJobParams = z.infer<typeof ImageJobParamsSchema>;

export const ImageJobSchema = BaseJobSchema.extend({
  type: z.literal("image"),
  model: z.string(),
  params: ImageJobParamsSchema,
  result: ImageResultSchema.optional(),
});
export type ImageJobSchemaType = z.infer<typeof ImageJobSchema>;

export class ImageJob<T extends ImageJobSchemaType> extends Job<T> {
  model: string;
  params: ImageJobParams;

  constructor(model: string) {
    super();
    this.model = model;
    this.params = {};
  }

  prompt(_prompt: string) {
    this.params.prompt = _prompt;
    return this;
  }

  n(_numImages: number) {
    this.params.n = _numImages;
    return this;
  }

  quality(_quality: string) {
    this.params.quality = _quality;
    return this;
  }

  responseFormat(_responseFormat: string) {
    this.params.responseFormat = _responseFormat;
    return this;
  }

  size(_imageSize: ImageSize) {
    this.params.size = _imageSize;
    return this;
  }

  style(_style: string) {
    this.params.style = _style;
    return this;
  }

  user(_user: string) {
    this.params.user = _user;
    return this;
  }

  numInferenceSteps(_numInferenceSteps: number) {
    this.params.numInferenceSteps = _numInferenceSteps;
    return this;
  }

  seed(_seed: number) {
    this.params.seed = _seed;
    return this;
  }

  guidanceScale(_guidanceScale: number) {
    this.params.guidanceScale = _guidanceScale;
    return this;
  }

  syncMode(_syncMode: boolean) {
    this.params.syncMode = _syncMode;
    return this;
  }

  enableSafetyChecker(_enableSafetyChecker: boolean) {
    this.params.enableSafetyChecker = _enableSafetyChecker;
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      type: "image" as const,
      model: this.model,
      params: this.params,
      provider: this.provider,
    };
  }
}

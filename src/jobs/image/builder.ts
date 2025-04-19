import { JobBuilder } from "~/jobs/builder";
import type { ImageInput, ImageOutput, ImageSize } from "./schema";

export class ImageJobBuilder extends JobBuilder<ImageInput, ImageOutput> {
  input: ImageInput;

  constructor(model: string) {
    super();
    this.type = "image";
    this.input = {
      model: model,
    };
  }

  prompt(prompt: string) {
    this.input.prompt = prompt;
    return this;
  }

  n(numImages: number) {
    this.input.n = numImages;
    return this;
  }

  quality(quality: string) {
    this.input.quality = quality;
    return this;
  }

  responseFormat(responseFormat: string) {
    this.input.responseFormat = responseFormat;
    return this;
  }

  size(imageSize: ImageSize) {
    this.input.size = imageSize;
    return this;
  }

  style(style: string) {
    this.input.style = style;
    return this;
  }

  user(user: string) {
    this.input.user = user;
    return this;
  }

  numInferenceSteps(numInferenceSteps: number) {
    this.input.numInferenceSteps = numInferenceSteps;
    return this;
  }

  seed(seed: number) {
    this.input.seed = seed;
    return this;
  }

  guidanceScale(guidanceScale: number) {
    this.input.guidanceScale = guidanceScale;
    return this;
  }

  syncMode(syncMode: boolean) {
    this.input.syncMode = syncMode;
    return this;
  }

  enableSafetyChecker(enableSafetyChecker: boolean) {
    this.input.enableSafetyChecker = enableSafetyChecker;
    return this;
  }

  stream() {
    this.input.stream = true;
    return this;
  }
}

import { Job } from "../job";
import type { ImageJob, ImageSize } from "./schema";

export class ImageJobBuilder extends Job<ImageJob> {
  job: ImageJob;

  constructor(model: string) {
    super();
    this.job = {
      type: "image",
      model: model,
    };
  }

  prompt(prompt: string) {
    this.job.prompt = prompt;
    return this;
  }

  n(numImages: number) {
    this.job.n = numImages;
    return this;
  }

  quality(quality: string) {
    this.job.quality = quality;
    return this;
  }

  responseFormat(responseFormat: string) {
    this.job.responseFormat = responseFormat;
    return this;
  }

  size(imageSize: ImageSize) {
    this.job.size = imageSize;
    return this;
  }

  style(style: string) {
    this.job.style = style;
    return this;
  }

  user(user: string) {
    this.job.user = user;
    return this;
  }

  numInferenceSteps(numInferenceSteps: number) {
    this.job.numInferenceSteps = numInferenceSteps;
    return this;
  }

  seed(seed: number) {
    this.job.seed = seed;
    return this;
  }

  guidanceScale(guidanceScale: number) {
    this.job.guidanceScale = guidanceScale;
    return this;
  }

  syncMode(syncMode: boolean) {
    this.job.syncMode = syncMode;
    return this;
  }

  enableSafetyChecker(enableSafetyChecker: boolean) {
    this.job.enableSafetyChecker = enableSafetyChecker;
    return this;
  }

  stream() {
    this.job.stream = true;
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      ...this.job,
    };
  }
}

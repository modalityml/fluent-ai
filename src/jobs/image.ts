import { Job } from "./job";

export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9"
  | { width: number; height: number };

export class ImageJob extends Job {
  params: {
    prompt?: string;
    n?: number;
    quality?: string;
    responseFormat?: string;
    size?: ImageSize;
    style?: string;
    user?: string;
    numInferenceSteps?: number;
    seed?: number;
    guidanceScale?: number;
    syncMode?: boolean;
    enableSafetyChecker?: boolean;
  };

  constructor() {
    super();
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
    return { ...obj, image: { model: this.model, params: this.params } };
  }
}

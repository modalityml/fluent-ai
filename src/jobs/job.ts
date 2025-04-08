import { version } from "../../package.json";
import type {
  JobBaseType,
  JobOptionsType,
  JobProviderType,
  JobTypeType,
} from "./schema";

export class Job<T extends JobBaseType> {
  options!: JobOptionsType;
  params: any;
  provider!: JobProviderType;
  type!: JobTypeType;
  model!: string;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  _setParams(params: any) {
    this.params = { ...this.params, ...params };
    return this;
  }

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    return await this.handleResponse!(response);
  }

  dump(): T {
    return {
      version: version,
      type: this.type,
      options: this.options,
      params: this.params,
    } as unknown as T;
  }
}

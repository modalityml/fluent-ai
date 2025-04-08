import { z } from "zod";
import { version } from "../../package.json";
import { runRemoteJob, type JobRemoteOptions } from "./remote";
import type {
  OptionsSchema,
  ProviderSchema,
  JobTypeSchema,
  BaseJobSchemaType,
} from "./schema";

export class Job<T extends BaseJobSchemaType> {
  options!: z.infer<typeof OptionsSchema>;
  params: any;
  provider!: z.infer<typeof ProviderSchema>;
  type!: z.infer<typeof JobTypeSchema>;
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

  async remote(options?: JobRemoteOptions) {
    const payload = this.dump();
    return runRemoteJob(payload, options);
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

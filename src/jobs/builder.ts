import { version } from "../../package.json";
import type { JobOptions, JobProvider } from "./schema";

export class JobBuilder {
  provider!: JobProvider;
  options!: JobOptions;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    return await this.handleResponse!(response);
  }

  dump() {
    return {
      version: version,
      provider: this.provider,
      options: this.options,
    };
  }
}

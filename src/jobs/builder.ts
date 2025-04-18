import { version } from "../../package.json";
import type { JobOptions, JobProvider } from "./schema";

class HTTPError extends Error {}

export class JobBuilder {
  provider!: JobProvider;
  options!: JobOptions;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(`Fetch error: ${response.statusText}`);
    }
    return await this.handleResponse!(response);
  }

  // TODO: result for streaming
  async done() {}

  dump() {
    return {
      version: version,
      provider: this.provider,
      options: this.options,
    };
  }
}

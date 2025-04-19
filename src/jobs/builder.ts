import { version } from "../../package.json";
import type { JobOptions, JobProvider } from "./schema";

export class HTTPError extends Error {
  status: number;
  json?: any;

  constructor(message: string, status: number, json?: any) {
    super(message);
    this.status = status;
    this.json = json;
  }
}

export class JobBuilder {
  provider!: JobProvider;
  options!: JobOptions;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    if (!response.ok) {
      let json;
      try {
        json = await response.json();
      } catch (e) {}

      throw new HTTPError(
        `Fetch error: ${response.statusText}`,
        response.status,
        json
      );
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

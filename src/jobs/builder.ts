import { version } from "../../package.json";
import type { Job } from "./load";
import type {
  JobCost,
  JobOptions,
  JobPerformance,
  JobProvider,
  JobType,
} from "./schema";

export class HTTPError extends Error {
  status: number;
  json?: any;

  constructor(message: string, status: number, json?: any) {
    super(message);
    this.status = status;
    this.json = json;
  }
}

export class JobBuilder<Input, Output> {
  provider!: JobProvider;
  options!: JobOptions;
  type!: JobType;
  input?: Input;
  output?: Output;
  cost?: JobCost;
  performance?: JobPerformance; // TODO: track job performance

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  async run(): Promise<Output> {
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

  dump() {
    return {
      version: version,
      provider: this.provider,
      options: this.options,
      type: this.type,
      input: this.input!,
      output: this.output as any,
      cost: this.cost,
      performance: this.performance,
    } as Job;
  }
}

import { version } from "../../package.json";
import type { BaseJob } from "./schema";

export class HTTPError extends Error {
  status: number;
  json?: any;

  constructor(message: string, status: number, json?: any) {
    super(message);
    this.status = status;
    this.json = json;
  }
}

export abstract class JobBuilder<Job extends BaseJob> {
  provider!: Job["provider"];
  options!: Job["options"];
  type!: Job["type"];
  input?: Job["input"];
  output?: Job["output"];
  cost?: Job["cost"];
  performance?: Job["performance"]; // TODO: track job performance

  abstract makeRequest(): Request;


  async handleResponse(response: Response): Promise<Job["output"]> {
    throw new Error("Not implemented");
  }
  
  async run(): Promise<Job["output"]> {
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
        json,
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
      output: this.output,
      cost: this.cost,
      performance: this.performance,
    };
  }
}

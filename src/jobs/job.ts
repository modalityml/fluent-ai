import { version } from "../../package.json";
import type {
  BaseJob,
  JobOptions,
  JobProviderType,
  JobTypeType,
} from "./schema";

// export class Job<T extends BaseJob> {
export class Job {
  // options!: JobOptions;
  // provider!: JobProviderType;
  // type!: JobTypeType;
  // model!: string;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    return await this.handleResponse!(response);
  }

  dump() {
    // return {
    //   version: version,
    //   type: this.type,
    //   options: this.options,
    // };
  }

  // dump(): T {
  //   return {
  //     version: version,
  //     type: this.type,
  //     options: this.options,
  //   } as unknown as T;
  // }
}

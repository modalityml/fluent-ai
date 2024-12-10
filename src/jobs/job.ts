import { version } from "../../package.json";

export class Job {
  params?: object;
  model?: string;

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

  async dump() {
    return {
      version: version,
      model: this.model,
      params: this.params,
    };
  }
}

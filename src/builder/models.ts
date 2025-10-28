import type { Job, Options, ProviderName } from "~/src/job/schema";
import { run } from "~/src/job/registry";

export interface ModelsBuilder {
  build(): Job;
  run(): Promise<any>;
}

export class BaseModelsBuilder implements ModelsBuilder {
  constructor(
    private provider: ProviderName,
    private options?: Options,
    private version?: string,
  ) {}

  build(): Job {
    return {
      provider: this.provider,
      version: this.version,
      options: this.options,
      body: {
        type: "models",
        input: {},
      },
    } as Job;
  }

  async run(): Promise<any> {
    return run(this.build());
  }
}

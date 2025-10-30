export class ModelsBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;

  constructor(provider: TProvider, options: any, runner: any) {
    this.provider = provider;
    this.options = options;
    this.runner = runner;
  }

  build() {
    return {
      provider: this.provider,
      options: this.options,
      body: {
        type: "models" as const,
      },
    };
  }

  run() {
    const job = this.build();
    return this.runner.models(job.options);
  }
}

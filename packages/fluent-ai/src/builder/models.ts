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
      type: "models" as const,
      provider: this.provider,
      options: this.options,
    };
  }

  run() {
    const job = this.build();
    return this.runner.models(job.options);
  }
}

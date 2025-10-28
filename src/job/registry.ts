import type { JobType, Job, ProviderName } from "~/src/job/schema";

class ProviderRegistry {
  private handlers = new Map<string, Map<JobType, any>>();

  register(provider: ProviderName, type: JobType, handler: any): void {
    if (!this.handlers.has(provider)) {
      this.handlers.set(provider, new Map());
    }
    this.handlers.get(provider)!.set(type, handler);
  }

  get(provider: ProviderName, type: JobType): any | undefined {
    return this.handlers.get(provider)?.get(type);
  }
}

export const registry = new ProviderRegistry();

export async function run(job: Job): Promise<any> {
  const { provider, body } = job;
  const handler = registry.get(provider as ProviderName, body.type as JobType);
  if (!handler) {
    throw new Error(
      `Provider '${provider}' does not support job type '${body.type}'`,
    );
  }
  return handler.execute(body, job.options);
}

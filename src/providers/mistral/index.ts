export function mistral(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.MISTRAL_API_KEY;

  return {
    chat(model: string) {},
  };
}

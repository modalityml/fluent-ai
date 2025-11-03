import * as z from "zod";

export const agentToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  input: z.instanceof(z.ZodObject),
  output: z.instanceof(z.ZodType).optional(),
  execute: z.function({ input: [z.any(), z.any()] }),
});

export type AgentTool<TContext = any> = Omit<
  z.infer<typeof agentToolSchema>,
  "execute"
> & {
  execute: (input: any, context: TContext) => any | Promise<any>;
};

export class AgentToolBuilder<
  TInput extends z.ZodObject<any> = z.ZodObject<any>,
  TOutput extends z.ZodType = z.ZodType,
  TContext = any,
> {
  private body: Partial<AgentTool<TContext>> = {};

  constructor(name: string) {
    this.body.name = name;
  }

  description(description: string) {
    this.body.description = description;
    return this;
  }

  input<T extends z.ZodObject<any>>(schema: T) {
    this.body.input = schema;
    return this as unknown as AgentToolBuilder<T, TOutput, TContext>;
  }

  output<T extends z.ZodType>(schema: T) {
    this.body.output = schema;
    return this as unknown as AgentToolBuilder<TInput, T, TContext>;
  }

  execute(
    fn: (
      input: z.infer<TInput>,
      context: TContext,
    ) => z.infer<TOutput> | Promise<z.infer<TOutput>>,
  ) {
    this.body.execute = fn;
    return this;
  }

  build() {
    return agentToolSchema.parse(this.body) as AgentTool<TContext>;
  }
}

export function agentTool(name: string) {
  return new AgentToolBuilder(name);
}

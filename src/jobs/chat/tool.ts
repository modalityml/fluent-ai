import { z } from "zod";
import type { ChatToolSchema } from "./schema";

export class ChatTool {
  public params: z.infer<typeof ChatToolSchema>;

  constructor(name: string) {
    this.params = { name };
  }

  description(description: string) {
    this.params.description = description;
    return this;
  }

  parameters(parameters: z.ZodType) {
    this.params.parameters = parameters;
    return this;
  }
}

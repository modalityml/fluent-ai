import { ZodSchema } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export class ChatTool {
  public params: {
    name: string;
    description?: string;
    parameters?: ZodSchema;
  };

  constructor(name: string) {
    this.params = { name };
  }

  description(description: string) {
    this.params.description = description;
    return this;
  }

  parameters(parameters: ZodSchema) {
    this.params.parameters = parameters;
    return this;
  }

  toJSON() {
    return {
      type: "function",
      function: {
        name: this.params.name,
        description: this.params.description,
        parameters: zodToJsonSchema(this.params.parameters!),
      },
    };
  }
}

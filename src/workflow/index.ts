import * as z from "zod";

const workflowSchema = z.object({
  name: z.string(),
});

class Workflow {
  private body: z.infer<typeof workflowSchema>;
  constructor(name: string) {
    this.body = { name };
  }
}

export function workflow(name: string) {
  return new Workflow(name);
}

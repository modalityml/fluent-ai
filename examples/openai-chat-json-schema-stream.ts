import { z } from "zod";
import { openai, userPrompt } from "../src";

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const job = openai()
  .chat("gpt-4o-mini")
  .messages([userPrompt("generate a person with name and age in json format")])
  .jsonSchema(personSchema, "person")
  .stream();

const { objectStream } = await job.run();
for await (const object of objectStream) {
  console.log(object);
}

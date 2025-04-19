import { z } from "zod";
import { openai, partialParse, text, user } from "../src";

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const job = openai()
  .chat("gpt-4o-mini")
  .messages([user("generate a person with name and age in json format")])
  .jsonSchema(personSchema, "person")
  .stream();

let content = "";
for await (const event of await job.run()) {
  content += text(event);
  console.log(partialParse(content));
}
const person = personSchema.parse(JSON.parse(content));
console.log(person);

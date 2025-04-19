import { z } from "zod";
import { openai, user, object } from "../src";

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});
const job = openai()
  .chat("gpt-4o-mini")
  .messages([user("generate a person with name and age in json format")])
  .jsonSchema(personSchema, "person");

const result = await job.run();
const person = personSchema.parse(object(result));
console.log(person);

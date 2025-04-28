import { text, openai } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .prompt("generate a 50 words text")
  .stream();
for await (const chunk of job) {
  console.log(chunk?.message);
}

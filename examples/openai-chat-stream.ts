import { text, openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([userPrompt("generate a 50 words text")])
  .stream();

const stream = await job.run();
for await (const chunk of stream) {
  process.stdout.write(text(chunk));
}
const output = await job.done();
console.log(output);

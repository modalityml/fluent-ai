import { chunkText, openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([userPrompt("generate a 50 words text")])
  .stream();

const stream = await job.run();
for await (const chunk of stream) {
  // console.log(chunk);
  process.stdout.write(chunkText(chunk));
}
const result = await job.done();
console.log(result);

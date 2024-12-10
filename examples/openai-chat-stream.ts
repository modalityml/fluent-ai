import { openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([userPrompt("generate a 50 words text")])
  .stream();
const { textStream } = await job.run();

for await (const text of textStream) {
  process.stdout.write(text);
}

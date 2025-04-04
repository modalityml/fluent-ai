import { chunkText, openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([userPrompt("generate a 50 words text")])
  .stream();

const stream = await job.run();

for await (const event of stream) {
  process.stdout.write(chunkText(event));
}

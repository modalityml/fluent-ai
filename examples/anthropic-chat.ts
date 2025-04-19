import { anthropic, user } from "../src";

const job = anthropic()
  .chat("claude-3-5-sonnet-20241022")
  .maxTokens(1024)
  .messages([user("Hello, world")]);
const result = await job.run();
console.log(result.raw);

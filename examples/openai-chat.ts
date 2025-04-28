import { openai, system, text, user } from "../src";

const job = openai({})
  .chat("gpt-4o-mini")
  .messages([system("you are a helpful assistant"), user("hi")]);
const result = await job.run();
console.log(result?.message);

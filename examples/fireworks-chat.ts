import { fireworks, system, user } from "../src";

const job = await fireworks()
  .chat("accounts/fireworks/models/llama-v3p1-70b-instruct")
  .messages([system("you are a helpful assistant"), user("hi")]);
const result = await job.run();

console.log(result);

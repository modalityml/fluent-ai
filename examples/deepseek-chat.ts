import { deepseek, system, user } from "../src";

const job = deepseek()
  .chat("deepseek-chat")
  .messages([system("you are a helpful assistant"), user("who are you")]);
const result = await job.run();

console.log(result);

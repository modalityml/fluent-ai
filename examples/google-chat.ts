import { google, system, user, text } from "../src";

const job = google()
  .chat("gemini-1.5-flash")
  .messages([system("you are a helpful assistant"), user("hi")]);
const result = await job.run();
console.log(text(result));

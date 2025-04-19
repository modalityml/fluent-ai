import { google, system, user, text } from "../src";

const job = google()
  .chat("gemini-1.5-flash")
  .messages([system("you are a helpful assistant"), user("hi")])
  .stream();
for await (const chunk of await job.run()) {
  console.log(text(chunk));
}

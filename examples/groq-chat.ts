import { openai, system, text, user } from "../src";

const job = openai({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})
  .chat("meta-llama/llama-4-scout-17b-16e-instruct")
  .messages([
    system("you are a helpful assistant"),
    user("write a 100 word story"),
  ])
  .stream();
for await (const chunk of await job.run()) {
  process.stdout.write(text(chunk));
}

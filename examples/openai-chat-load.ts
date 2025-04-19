import { load } from "../src";

const job = load({
  provider: "openai",
  type: "chat",
  input: {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "hi" }],
  },
});
const result = await job.run();
console.log(result);

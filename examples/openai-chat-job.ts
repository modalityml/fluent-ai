import { load } from "../src";

const job = load({
  provider: "openai",
  chat: {
    model: "gpt-4o-mini",
    params: {
      messages: [{ role: "user", content: "hi" }],
    },
  },
});
const result = await job.run();
console.log(result);

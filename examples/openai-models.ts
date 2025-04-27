import { openai } from "../src";

const job = openai().models();
const result = await job.run();
for (const model of result.raw.data) {
  console.log(model.id);
}

import { fal } from "../src";

const job = fal().image("fal-ai/flux/dev").prompt("A cat on a horse");
const stream = await job.run();

for await (const event of stream) {
  console.log(event);
}

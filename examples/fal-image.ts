import { fal } from "../src";

const job = fal().image("fal-ai/flux/dev").prompt("A cat on a horse");
const result = await job.run();

console.log(result);

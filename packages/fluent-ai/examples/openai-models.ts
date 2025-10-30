import { openai } from "~/src/index";

const job = openai().models();
const result = await job.run();

console.log(result);

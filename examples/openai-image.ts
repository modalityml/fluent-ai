import { openai } from "../src";

const job = openai()
  .image("dalle-2")
  .prompt("a cat")
  .size({ width: 512, height: 512 });
const result = await job.run();
console.log(result);

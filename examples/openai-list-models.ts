import { openai } from "../src";

const models = await openai().models();

console.log(models);

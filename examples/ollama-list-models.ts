import { ollama } from "../src";

const models = await ollama().models();

console.log(models);

import { ollama } from "../src";

const models = await ollama().models().run();

console.log(models);

const response = await ollama()
  .chat(models[0].name)
  .messages([
    {
      role: "user",
      content: "What is the capital of France?",
    },
  ])
  .run();

console.log(response);

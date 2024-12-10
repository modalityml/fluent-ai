import { openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([
    userPrompt(
      "What are in these images? Is there any difference between them?",
      {
        image: {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
        },
      },
      {
        image: {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
        },
      }
    ),
  ]);
const result = await job.run();

console.log(result.text);

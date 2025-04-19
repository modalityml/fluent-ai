import { openai, text } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        {
          type: "image_url",
          image_url: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
      ],
    },
  ])
  .stream();
const stream = await job.run();
for await (const chunk of stream) {
  process.stdout.write(text(chunk));
}

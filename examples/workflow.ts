import { z } from "zod";
import { openai, workflow } from "../src";

const flow = workflow("workflow1")
  .input(
    z.object({
      description: z.string(),
    })
  )
  .step("step1", ({ context }) => {
    return openai()
      .chat("gpt-4o-mini")
      .prompt(
        `generate a story based on following description: ${context.input.description}`
      )
      .jsonSchema(
        z.object({
          story: z.string(),
        })
      );
  })
  .step("step2", ({ context }) => {
    return elevenlabs()
      .tts("eleven_multilingual_v2")
      .text(context.steps.step1.story);
  });

const result = await flow.run({
  input: { description: "fire engine and a cat" },
});
console.log(result);

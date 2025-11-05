import { test, expect, mock } from "bun:test";
import {
  jobSchema,
  openrouter,
  openai,
  fal,
  type Job,
  user,
  voyage,
  type ImageJob,
} from "~/src/index";
import { Runner } from "~/src/job/runner";

test("chat job", () => {
  const job: Job = {
    provider: "openrouter",
    type: "chat",
    input: {
      model: "test-model",
      messages: [{ role: "user", content: "hello" }],
    },
  };

  expect(() => {
    jobSchema.parse(job);
  }).not.toThrow();

  expect(job).toEqual(
    openrouter()
      .chat("test-model")
      .messages([user("hello")])
      .build(),
  );
});

test("image job", () => {
  const job: Job = {
    provider: "fal",
    type: "image",
    input: {
      model: "fal-ai/bytedance/seedream/v4/text-to-image",
      prompt: "A beautiful sunset over the mountains",
      size: { width: 1280, height: 1280 },
    },
  };
  expect(() => {
    jobSchema.parse(job);
  }).not.toThrow();

  expect(job).toEqual(
    fal()
      .image("fal-ai/bytedance/seedream/v4/text-to-image")
      .prompt("A beautiful sunset over the mountains")
      .size({ width: 1280, height: 1280 })
      .build(),
  );
});

test("image edit job", () => {
  const job: ImageJob = {
    provider: "fal",
    type: "image",
    input: {
      model: "fal-ai/bytedance/seedream/v4/edit",
      prompt:
        "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
      edit: [
        "./input1.png",
        "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
      ],
      size: {
        width: 3840,
        height: 2160,
      },
      upload: "base64",
    },
  };

  expect(job).toEqual(
    fal()
      .image("fal-ai/bytedance/seedream/v4/edit")
      .prompt(
        "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
      )
      .edit([
        "./input1.png",
        "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
      ])
      .size({ width: 3840, height: 2160 })
      .upload("base64")
      .build(),
  );
});

test("embedding job", () => {
  const job: Job = {
    provider: "voyage",
    type: "embedding",
    input: {
      model: "voyage-3-lite",
      input: "This is a test",
    },
  };

  expect(() => {
    jobSchema.parse(job);
  }).not.toThrow();

  expect(job).toEqual(
    voyage().embedding("voyage-3-lite").input("This is a test").build(),
  );
});

test("models job", () => {
  const job: Job = {
    type: "models",
    provider: "openai",
  };

  expect(() => {
    jobSchema.parse(job);
  }).not.toThrow();

  expect(job).toEqual(openai().models().build());
});

test("runner", () => {
  const chatRunner = mock(() => "test");
  const runner = new Runner({ openrouter: { chat: chatRunner } });

  const job: Job = {
    provider: "openrouter",
    type: "chat",
    input: {
      model: "test-model",
      messages: [{ role: "user", content: "hello" }],
    },
  };

  expect(runner.run(job)).toBe("test");
  expect(chatRunner).toHaveBeenCalledWith(job.input, undefined);
});

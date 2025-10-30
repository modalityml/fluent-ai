import { test, expect, mock } from "bun:test";
import { jobSchema, openrouter, type Job, user, voyage } from "~/src/index";
import { Runner } from "~/src/job/runner";

test("chat job", () => {
  const job: Job = {
    provider: "openrouter",
    body: {
      type: "chat",
      input: {
        model: "test-model",
        messages: [{ role: "user", content: "hello" }],
      },
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

test("embedding job", () => {
  const job: Job = {
    provider: "voyage",
    body: {
      type: "embedding",
      input: {
        model: "voyage-3-lite",
        input: "This is a test",
      },
    },
  };

  expect(() => {
    jobSchema.parse(job);
  }).not.toThrow();

  expect(job).toEqual(
    voyage().embedding("voyage-3-lite").input("This is a test").build(),
  );
});

test("runner", () => {
  const chatRunner = mock(() => "test");
  const runner = new Runner({ openrouter: { chat: chatRunner } });

  const job: Job = {
    provider: "openrouter",
    body: {
      type: "chat",
      input: {
        model: "test-model",
        messages: [{ role: "user", content: "hello" }],
      },
    },
  };

  expect(runner.run(job)).toBe("test");
  expect(chatRunner).toHaveBeenCalledWith(job.body.input, undefined);
});

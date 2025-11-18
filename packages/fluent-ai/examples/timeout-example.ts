/**
 * Example demonstrating timeout feature
 * 
 * This example shows how to use the timeout option with fluent-ai
 */

import { openai, user } from "../src/index";

// Example 1: Using timeout with OpenAI chat
async function exampleWithTimeout() {
  console.log("Example 1: Chat with 10 second timeout");
  
  const job = openai({ timeout: 10000 }) // 10 second timeout
    .chat("gpt-4o-mini")
    .messages([user("What is AI?")]);
  
  try {
    const result = await job.run();
    console.log("Success:", result);
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      console.error("Request timed out!");
    } else {
      console.error("Request failed:", error);
    }
  }
}

// Example 2: Using timeout with declarative API
async function exampleDeclarative() {
  console.log("\nExample 2: Declarative API with timeout");
  
  const job = {
    type: "chat" as const,
    provider: "openai" as const,
    options: {
      timeout: 10000, // 10 second timeout
    },
    input: {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello!" }],
    },
  };
  
  console.log("Job definition:", JSON.stringify(job, null, 2));
}

// Example 3: No timeout (default behavior)
async function exampleNoTimeout() {
  console.log("\nExample 3: Without timeout (default behavior)");
  
  const job = openai()
    .chat("gpt-4o-mini")
    .messages([user("What is AI?")]);
  
  console.log("Job will use default fetch behavior without timeout");
}

// Run examples (commented out to avoid actual API calls in example)
// exampleWithTimeout();
exampleDeclarative();
exampleNoTimeout();

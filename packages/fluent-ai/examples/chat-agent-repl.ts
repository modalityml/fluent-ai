import { agent, agentRepl, openrouter } from "~/src/index";

const chatAgent = agent("chat-agent")
  .model(openrouter().chat("google/gemini-2.5-flash"))
  .instructions(() => "You are a helpful chat agent.");

await agentRepl(chatAgent);

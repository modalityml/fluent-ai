import * as readline from "node:readline/promises";
import type { Agent } from "~/src/agent/agent";
import type { Message, MessagePart } from "~/src/job/schema";

export async function agentReplInput(): Promise<Message> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const userInput = await rl.question("\nYou: ");
  rl.close();

  const newMessage = {
    role: "user" as const,
    parts: [
      {
        type: "text",
        text: userInput,
      },
    ],
  };

  return newMessage;
}

export async function agentRepl(agent: Agent) {
  let allMessages: Message[] = [];
  while (true) {
    const userMessage = await agentReplInput();
    allMessages = allMessages.concat([userMessage]);
    const stream = agent.generate(allMessages, { maxSteps: 8 });
    for await (const event of stream) {
      if (event.type === "text-delta") {
        process.stdout.write((event.data as any).text);
      } else if (event.type === "tool-call-input") {
        const toolPart = event.data as MessagePart;
        console.log(
          `\n[Calling tool ${toolPart.type} with input: ${JSON.stringify(toolPart.input)}]`,
        );
      } else if (event.type === "tool-call-output") {
        const toolPart = event.data as MessagePart;
        console.log(
          `\n[Calling tool ${toolPart.type} with output: ${JSON.stringify(toolPart.output || toolPart.outputError)}]`,
        );
      } else if (event.type === "message-created") {
        const data = event.data as Message;
        allMessages = allMessages.concat([data]);
      }
    }
    console.log();
  }
}

import * as z from "zod";
import { convertMessagesForChatCompletion } from "~/src/agent/message";
import { agentToolSchema, type AgentToolBuilder } from "~/src/agent/tool";
import type { Message } from "~/src/job/schema";
import type { ChatBuilder } from "~/src/builder/chat";

export const agentSchema = z.object({
  name: z.string(),
  instructions: z.union([z.string(), z.function({ output: z.string() })]),
  tools: z.array(agentToolSchema),
});

interface GenerateOptions {
  maxSteps: number;
}

export class Agent {
  private body: z.infer<typeof agentSchema>;
  private builder?: ChatBuilder;

  constructor(name: string) {
    this.body = { name, tools: [], instructions: "" };
  }

  model(builder: ChatBuilder) {
    this.builder = builder;
    return this;
  }

  instructions(createAgentInstructions: () => string) {
    this.body.instructions = createAgentInstructions;
    return this;
  }

  tool(tool: AgentToolBuilder) {
    this.body.tools.push(tool.build());
    return this;
  }

  generate = async function* (
    this: Agent,
    initialMessages: Message[],
    options: GenerateOptions,
  ) {
    const body = agentSchema.parse(this.body);

    let shouldBreak = false;

    let newMessages: Message[] = [];
    for (let iteration = 0; iteration < options.maxSteps; iteration++) {
      if (shouldBreak) {
        break;
      }

      const instructions =
        typeof body.instructions === "function"
          ? body.instructions()
          : body.instructions;
      const allMessages = initialMessages.concat(newMessages);
      const convertedMessages = convertMessagesForChatCompletion(allMessages);
      const messages = [{ role: "system", content: instructions }].concat(
        convertedMessages as any,
      );
      // TODO: agent tool vs chat tool
      const tools = body.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input: z.toJSONSchema(tool.input),
      }));
      const result = await this.builder!.messages(messages)
        .tools(tools)
        .stream()
        .run();

      let totalText = "";
      for await (const chunk of result) {
        const delta = chunk.raw.choices[0].delta;

        // TODO: tool calls with content??
        if (delta.tool_calls) {
          // TODO: tool call with content
          // TODO: tool call with input streaming
          // TODO: support multiple tool calls
          const toolCall = delta.tool_calls[0];
          const toolName = toolCall.function.name;
          const input = JSON.parse(toolCall.function.arguments); // TODO: parsing error handling

          const agentTool = body.tools.find((t) => t.name === toolName);
          if (!agentTool) {
            throw new Error(`Unknown tool: ${toolName}`);
          }

          const toolPart = {
            type: "tool-" + toolName,
            toolCallId: toolCall.id,
            input: input,
          };

          yield { type: "tool-call-input", data: toolPart };

          let output = null;
          let outputError = null; // TODO: save output error

          try {
            output = await agentTool.execute(input);
          } catch (err) {
            outputError = (err as Error).message;
          }

          if (outputError) {
            yield {
              type: "tool-call-output",
              data: { ...toolPart, outputError },
            };
          } else {
            yield { type: "tool-call-output", data: { ...toolPart, output } };
          }

          const newMessage: Message = {
            role: "tool",
            parts: [
              {
                type: `tool-${toolName}`,
                toolCallId: toolCall.id,
                input: input,
                output: output,
                outputError: outputError,
              },
            ],
          };

          yield { type: "message-created", data: newMessage };
          newMessages.push(newMessage);
        } else if (delta.content) {
          const text = delta.content as string;
          yield { type: "text-delta", data: { text } };
          totalText += text;
          shouldBreak = true;
        }
      }

      if (totalText.trim()) {
        const newMessage: Message = {
          role: "assistant",
          parts: [{ type: "text", text: totalText.trim() }],
        };

        yield { type: "message-created", data: newMessage };
        newMessages.push(newMessage);
        shouldBreak = true;
      }
    }
  };
}

export function agent(name: string) {
  return new Agent(name);
}

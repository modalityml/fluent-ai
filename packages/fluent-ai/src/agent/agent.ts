import { z } from "zod";
import {
  agentToolSchema,
  type AgentToolBuilder,
  type AgentTool,
} from "~/src/agent/tool";
import type {
  Message,
  ToolMessage,
  MessageChunk,
  AssistantMessage,
} from "~/src/job/schema";
import type { ChatBuilder } from "~/src/builder/chat";

export const agentSchema = z.object({
  name: z.string(),
  instructions: z.union([z.string(), z.function({ output: z.string() })]),
  tools: z.array(agentToolSchema),
});

interface ChunkEvent {
  type: "chunk";
  chunk: {
    text?: string;
    reasoning?: string;
  };
}

interface ToolEvent {
  type: "tool";
  tool: {
    name: string;
    args: any;
    result?: any;
    error?: any;
  };
}

interface MessageEvent {
  type: "message";
  message: Message;
}

export interface AgentGenerateOptions {
  maxSteps: number;
}

export class Agent<TContext = any> {
  private body: Omit<z.infer<typeof agentSchema>, "tools"> & {
    tools: AgentTool<TContext>[];
  };
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

  tool(tool: AgentToolBuilder<any, any, TContext>) {
    this.body.tools.push(tool.build());
    return this;
  }

  generate = async function* (
    this: Agent<TContext>,
    initialMessages: Message[],
    options: AgentGenerateOptions,
    context?: TContext,
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
      const systemMessage = { role: "system", text: instructions };
      const messages = [systemMessage].concat(
        initialMessages,
        newMessages,
      ) as Message[];
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
      for await (const chunk of result as AsyncIterable<MessageChunk>) {
        if (chunk.toolCalls) {
          const toolCall = chunk.toolCalls[0];
          const { name, arguments: args } = toolCall.function;
          const agentTool = body.tools.find((t) => t.name === name);
          if (!agentTool) {
            throw new Error(`Unknown tool: ${name}`);
          }

          yield { type: "tool", tool: { name, args } };

          let result = null;
          let error = null;
          try {
            result = await agentTool.execute(args, context!);
          } catch (err) {
            error = (err as Error).message;
          }

          yield {
            type: "tool",
            tool: { name, args, result, error },
          } as ToolEvent;

          const newMessage: ToolMessage = {
            role: "tool",
            text: "",
            content: {
              callId: toolCall.id,
              name: name,
              args: args,
              result: result,
              error: error,
            },
          };

          newMessages.push(newMessage);
          shouldBreak = false;
        } else if (chunk.text || chunk.reasoning) {
          yield {
            type: "chunk",
            chunk: {
              text: chunk.text,
              reasoning: chunk.reasoning,
            },
          } as ChunkEvent;

          if (chunk.text) {
            totalText += chunk.text;
          }
          shouldBreak = true;
        }
      }

      if (totalText.trim()) {
        const newMessage: AssistantMessage = {
          role: "assistant",
          text: totalText,
        };

        yield { type: "message", message: newMessage } as MessageEvent;
        newMessages.push(newMessage);
        shouldBreak = true;
      }
    }
  };
}

export function agent<TContext = any>(name: string) {
  return new Agent<TContext>(name);
}

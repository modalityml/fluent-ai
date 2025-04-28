/**
 * Type definitions for OpenAI API responses
 * Based on https://platform.openai.com/docs/api-reference/chat/create
 */

// Common types
export interface OpenAIFunctionCall {
  name: string;
  arguments: string;
}

export interface OpenAIToolCall {
  id: string;
  type: string;
  function: OpenAIFunctionCall;
}

// Adding our internal format for tool calls that matches what we send to clients
export interface FormattedToolCall {
  id: string;
  type: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface OpenAIMessage {
  role: string;
  content: string | null;
  tool_calls?: OpenAIToolCall[];
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  logprobs: null | {
    content: Array<{
      token: string;
      logprob: number;
      top_logprobs: Record<string, number>;
    }>;
  };
  finish_reason: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Non-streaming response
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
  system_fingerprint: string;
}

// Streaming response types
export interface OpenAIDelta {
  role?: string;
  content?: string;
  tool_calls?: Array<{
    id?: string;
    type?: string;
    index?: number;
    function?: {
      name?: string;
      arguments?: string;
    };
  }>;
}

export interface OpenAIStreamChoice {
  index: number;
  delta: OpenAIDelta;
  logprobs: null | {
    content: Array<{
      token: string;
      logprob: number;
      top_logprobs: Record<string, number>;
    }>;
  };
  finish_reason: string | null;
}

export interface OpenAIStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIStreamChoice[];
  system_fingerprint: string;
}

// Request types

// Text or image content
export type OpenAIMessageContent = 
  | { type: "text"; text: string }
  | { 
      type: "image_url"; 
      image_url: { 
        url: string;
        detail?: "auto" | "low" | "high";
      } 
    }
  | {
      type: "image";
      image_url?: string;
      source?: {
        type: "base64";
        data: string;
        media_type: string;
      };
    };

// Message request with flexible content type
export interface OpenAIMessageRequest {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null | Array<OpenAIMessageContent>;
  name?: string;
  tool_calls?: Array<{
    type?: string;
    name?: string;
    id?: string;
    call_id?: string;
    arguments: Record<string, any>;
  }>;
  tool_call_id?: string;
}

export interface OpenAIFunctionDefinition {
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
}

export interface OpenAIToolDefinition {
  type: "function";
  function: OpenAIFunctionDefinition;
}

export type OpenAIToolChoice = 
  | "none" 
  | "auto" 
  | { type: "function"; function: { name: string } };

export interface OpenAIResponseFormat {
  type: "text" | "json_object";
}

export interface OpenAIJSONSchemaResponseFormat {
  type: "json_schema";
  schema: Record<string, unknown>;
}

export interface OpenAILogprobs {
  top_logprobs: number;
}

export interface OpenAIChatCompletionRequest {
  model: string;
  messages: OpenAIMessageRequest[];
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  max_tokens?: number;
  n?: number;
  presence_penalty?: number;
  response_format?: OpenAIResponseFormat | OpenAIJSONSchemaResponseFormat;
  seed?: number;
  stop?: string | string[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  tools?: OpenAIToolDefinition[];
  tool_choice?: OpenAIToolChoice;
  user?: string;
} 
import { useState, useEffect } from "react";
import type { Route } from "./+types/chat";
import { chatJobSchema, runner, type ChatJob } from "fluent-ai";
import { ChatPlayground } from "~/components/chat";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Copy } from "lucide-react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    providers: [
      {
        name: "openrouter",
        displayName: "OpenRouter",
        models: [
          { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
          { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
          { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
          { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
          { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
        ],
      },
    ],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const job = chatJobSchema.parse(await request.json());

  try {
    const output = await runner.run(job);
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default function Home({
  loaderData: { providers },
}: Route.ComponentProps) {
  const [job, setJob] = useState<ChatJob>({
    type: "chat",
    provider: providers[0].name as "openrouter" | "openai",
    options: {
      apiKey: "",
    },
    input: {
      model: providers[0].models[0].id || "",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hi, tell me a short joke!" },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    },
  });

  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "loading" || fetcher.state === "submitting") {
      setLoading(true);
      setError(null);
    } else if (fetcher.state === "idle" && fetcher.data) {
      setLoading(false);
      if (fetcher.data.success) {
        setOutput(fetcher.data.output);
        setError(null);
      } else {
        setError(fetcher.data.error || "Unknown error");
        setOutput(null);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleJobChange = (updatedJob: ChatJob) => {
    setJob(updatedJob);
  };

  const handleSubmit = async (jobToSubmit: ChatJob) => {
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      fetcher.submit(jobToSubmit, {
        method: "post",
        encType: "application/json",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <title>Chat</title>
      <div className="border-b bg-card shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Chat</h1>
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(job, null, 2));
            }}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
          >
            <Copy /> Copy
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ChatPlayground
          job={job}
          onChange={handleJobChange}
          providers={providers}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          output={output}
        />
      </div>
    </div>
  );
}

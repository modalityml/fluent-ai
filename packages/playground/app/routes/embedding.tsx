import { useState, useEffect } from "react";
import type { Route } from "./+types/embedding";
import { EmbeddingPlayground } from "~/components/embedding";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Copy } from "lucide-react";
import { embeddingJobSchema, runner, type EmbeddingJob } from "fluent-ai";

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    providers: [
      {
        name: "voyage" as const,
        displayName: "Voyage AI",
        models: [
          { id: "voyage-3", name: "Voyage 3" },
          { id: "voyage-3-lite", name: "Voyage 3 Lite" },
          { id: "voyage-code-3", name: "Voyage Code 3" },
          { id: "voyage-finance-2", name: "Voyage Finance 2" },
          { id: "voyage-law-2", name: "Voyage Law 2" },
          { id: "voyage-multilingual-2", name: "Voyage Multilingual 2" },
        ],
      },
    ],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const job = embeddingJobSchema.parse(await request.json());

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

export default function Embedding({ loaderData }: Route.ComponentProps) {
  const { providers } = loaderData;
  const [job, setJob] = useState<EmbeddingJob>({
    provider: providers[0].name,
    options: {
      apiKey: "",
    },
    type: "embedding",
    input: {
      model: providers[0].models[0].id || "",
      input: "The quick brown fox jumps over the lazy dog.",
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

  const handleJobChange = (updatedJob: EmbeddingJob) => {
    setJob(updatedJob);
  };

  const handleSubmit = async (jobToSubmit: EmbeddingJob) => {
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
      <title>Embedding</title>
      <div className="border-b bg-card shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Embedding</h1>
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
        <EmbeddingPlayground
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

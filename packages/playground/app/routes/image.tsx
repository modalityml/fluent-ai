import { useState, useEffect } from "react";
import type { Route } from "./+types/image";
import { runner } from "../../../fluent-ai/src/job/runner";
import type { Job } from "../../../fluent-ai/src/job/schema";
import { ImagePlayground } from "~/components/image";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Copy } from "lucide-react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    providers: [
      {
        name: "fal" as const,
        displayName: "Fal.ai",
        models: [
          {
            id: "fal-ai/bytedance/seedream/v4/text-to-image",
            name: "Seedream v4",
          },
          { id: "fal-ai/flux/dev", name: "FLUX.1 [dev]" },
          { id: "fal-ai/flux/schnell", name: "FLUX.1 [schnell]" },
          { id: "fal-ai/flux-pro", name: "FLUX.1 [pro]" },
          {
            id: "fal-ai/stable-diffusion-v3-medium",
            name: "Stable Diffusion v3",
          },
          { id: "fal-ai/fast-sdxl", name: "Fast SDXL" },
        ],
      },
    ],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const job: Job = await request.json();

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

export default function Image({
  loaderData: { providers },
}: Route.ComponentProps) {
  const [job, setJob] = useState<Job>({
    provider: providers[0].name,
    options: {
      apiKey: "",
    },
    body: {
      type: "image",
      input: {
        model: providers[0].models[0].id || "",
        prompt: "A serene landscape with mountains at sunset, digital art",
        size: { width: 1024, height: 1024 },
        n: 1,
      },
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

  const handleJobChange = (updatedJob: Job) => {
    setJob(updatedJob);
  };

  const handleSubmit = async (jobToSubmit: Job) => {
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
      <title>Image Generation</title>
      <div className="border-b bg-card shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Image Generation</h1>
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
        <ImagePlayground
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

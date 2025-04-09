import { z } from "zod";
import { ChatJobBuilder, ChatJobSchema, convertMessages } from "~/jobs/chat";
import { ListModelsJob, ModelsJobSchema } from "~/jobs/models";
import { EmbeddingJobBuilder, EmbeddingJobSchema } from "~/jobs/embedding";
import { type JobOptions } from "~/jobs/schema";

export class OllamaListModelsJob extends ListModelsJob<OllamaListModelsJobSchemaType> {
  constructor(options: JobOptions) {
    super();
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/tags", { method: "GET" });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

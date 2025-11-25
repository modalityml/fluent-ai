import type { ImageJob } from "~/src/job/schema";
import { createHTTPJob, downloadImages } from "~/src/job/http";
import { getApiKey } from "~/src/job/utils";

// TODO: switch to fal queue api
const BASE_URL = "https://fal.run";

export const runner = {
  image: async (input: ImageJob["input"], options?: ImageJob["options"]) => {
    const apiKey = getApiKey(options, "FAL_API_KEY");

    const request = new Request(`${BASE_URL}/${input.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input.prompt,
        image_size: input.size,
        num_images: input.n,
      }),
    });

    return createHTTPJob(request, async (response: Response) => {
      const data = await response.json();

      let images = data.images.map((img: any) => {
        return {
          url: img.url,
          width: img.width,
          height: img.height,
        };
      });

      if (input.download) {
        images = await downloadImages(images, input.download);
      }

      return { images };
    });
  },
};

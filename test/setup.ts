import { beforeEach, mock } from "bun:test";

function mockFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const mockData = { message: "This is a mock response" };
  const response = new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(response);
}

// beforeEach(() => {
//   global.fetch = mock((input: RequestInfo | URL, init?: RequestInit) =>
//     mockFetch(input, init)
//   );
// });

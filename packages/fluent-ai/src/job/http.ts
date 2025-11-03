export async function createHTTPJob<T>(
  request: RequestInfo | URL,
  handleResponse: (response: Response) => T | Promise<T>,
): Promise<T> {
  try {
    const response = await fetch(request);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
    throw error;
  }
}

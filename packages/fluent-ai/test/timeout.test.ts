import { test, expect, mock } from "bun:test";
import { createHTTPJob } from "~/src/job/http";

test("createHTTPJob passes timeout parameter correctly", async () => {
  // Test that the function signature accepts timeout
  const mockHandler = mock(async (response: Response) => ({ success: true }));
  
  // Mock fetch to return a successful response
  const originalFetch = global.fetch;
  global.fetch = mock(async () => new Response(JSON.stringify({ test: "data" })));
  
  try {
    const result = await createHTTPJob(
      "http://example.com",
      mockHandler,
      5000
    );
    
    expect(result).toEqual({ success: true });
    expect(mockHandler).toHaveBeenCalled();
  } finally {
    global.fetch = originalFetch;
  }
});

test("createHTTPJob works without timeout parameter", async () => {
  const mockHandler = mock(async (response: Response) => ({ success: true }));
  
  // Mock fetch to return a successful response
  const originalFetch = global.fetch;
  global.fetch = mock(async () => new Response(JSON.stringify({ test: "data" })));
  
  try {
    const result = await createHTTPJob(
      "http://example.com",
      mockHandler
    );
    
    expect(result).toEqual({ success: true });
    expect(mockHandler).toHaveBeenCalled();
  } finally {
    global.fetch = originalFetch;
  }
});

test("createHTTPJob throws timeout error on AbortError", async () => {
  const mockHandler = mock(async (response: Response) => ({ success: true }));
  const timeout = 1000;
  
  // Mock fetch to throw AbortError
  const originalFetch = global.fetch;
  global.fetch = mock(async () => {
    const error = new Error("The operation was aborted");
    error.name = "AbortError";
    throw error;
  });
  
  try {
    await createHTTPJob(
      "http://example.com",
      mockHandler,
      timeout
    );
    throw new Error("Should have thrown timeout error");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("timed out");
    expect((error as Error).message).toContain("1000ms");
  } finally {
    global.fetch = originalFetch;
  }
});

test("createHTTPJob propagates non-abort errors", async () => {
  const mockHandler = mock(async (response: Response) => ({ success: true }));
  
  // Mock fetch to throw a regular error
  const originalFetch = global.fetch;
  global.fetch = mock(async () => {
    throw new Error("Network error");
  });
  
  try {
    await createHTTPJob(
      "http://example.com",
      mockHandler
    );
    throw new Error("Should have thrown network error");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("HTTP request failed");
    expect((error as Error).message).toContain("Network error");
  } finally {
    global.fetch = originalFetch;
  }
});


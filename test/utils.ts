export async function requestObject(request: Request) {
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers as any),
    body: await request.text(),
  };
}

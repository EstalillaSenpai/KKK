import type { IncomingMessage, ServerResponse } from "http";
import server from "../dist/server/server.js";

function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const host = (req.headers.host as string) || "localhost";
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const url = `${proto}://${host}${(req as any).url}`;

    const rawBody = await readRawBody(req);
    const init: any = { method: (req as any).method, headers: req.headers };
    if (rawBody && rawBody.length) init.body = rawBody;

    const request = new Request(url, init);

    // call the existing server handler (it exports default { fetch })
    const response = await server.fetch(request, process.env, {});

    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => res.setHeader(key, value));
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.end(buffer);
  } catch (err: any) {
    console.error("Vercel adapter error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

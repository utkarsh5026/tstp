export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class HttpRequest {
  method: HttpMethod;
  path: string;
  headers: Record<string, string>;
  body: string;

  constructor(
    method: HttpMethod,
    path: string,
    headers: Record<string, string>,
    body: string
  ) {
    this.method = method;
    this.path = path;
    this.headers = headers;
    this.body = body;
  }

  static fromBuffer(data: Buffer): HttpRequest {
    const parts = data.toString().split("\n");
    const [method, path] = parts[0].split(" ");

    const headers = parts.slice(1, -2).reduce((acc, line) => {
      line = line.trim();
      const [key, value] = line.split(": ");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const body = parts.slice(-1)[0];
    return new HttpRequest(method as HttpMethod, path, headers, body);
  }

  getHeader(key: string): string {
    return this.headers[key];
  }

  containsHeader(key: string): boolean {
    return key in this.headers;
  }
}

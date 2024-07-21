export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
}

const StatusNames: Record<StatusCode, string> = {
  200: "OK",
  201: "Created",
  404: "Not Found",
};

class ResponseWriter {
  private parts: string[] = [];

  writeString(str: string) {
    this.parts.push(str);
    this.parts.push("\r\n");
  }

  writeHeaders(headers: Record<string, string | number>) {
    const headerStrings = Object.entries(headers).map(
      ([key, value]) => `${key}: ${value}`
    );
    this.parts.push(headerStrings.join("\r\n"));
    this.parts.push("\r\n");
  }

  toString(): string {
    return this.parts.join("");
  }

  clear() {
    this.parts = [];
  }
}

export class HttpResponse {
  httpVersion: string;
  statusCode: StatusCode;
  headers: Record<string, string | number>;
  body: string;
  private writer: ResponseWriter;

  constructor(
    httpVersion: string,
    statusCode: number,
    headers: Record<string, string | number>,
    body: string
  ) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    this.writer = new ResponseWriter();
  }

  toString(): string {
    const statusLine = `${this.httpVersion} ${this.statusCode} ${
      StatusCode[this.statusCode]
    }`;

    this.writer.writeString(statusLine);
    this.writer.writeHeaders(this.headers);
    this.writer.writeString(this.body);

    const result = this.writer.toString();
    this.writer.clear();
    return result;
  }
}

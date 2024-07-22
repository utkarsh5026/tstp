import { ResponseWriter } from "./writer";
import { StatusCode, StatusNames } from "./status";
import { Socket } from "net";

export const HTTP_VERSION = "HTTP/1.1";

type ResponseBody = Buffer | string;
export class HttpResponse {
  private headers: Record<string, string | number>;
  private body: ResponseBody;
  private socket: Socket;
  private sent: boolean;

  private constructor(socket: Socket) {
    this.headers = {};
    this.socket = socket;
    this.body = Buffer.alloc(0);
    this.sent = false;
  }

  setHeader(key: string, value: string | number) {
    this.headers[key] = value;
  }

  getHeader(key: string): string | number | undefined {
    return this.headers[key];
  }

  getHeaders(): Record<string, string | number> {
    return this.headers;
  }

  send(
    code: StatusCode,
    body: ResponseBody,
    headers: Record<string, string> = {}
  ) {
    if (headers instanceof Object)
      Object.entries(headers).forEach(([key, value]) => {
        this.setHeader(key, value);
      });

    const writer = new ResponseWriter();

    const statusLine = `${HTTP_VERSION} ${code} ${StatusNames[code]}`;
    writer.writeString(statusLine);
    writer.writeHeaders(this.headers);

    console.log("co", writer.toString());
    this.socket.write(writer.toString());
    this.socket.write(body);
  }

  getBody(): ResponseBody {
    return this.body;
  }

  setBody(body: ResponseBody) {
    this.body = body;
  }

  static initialize(socket: Socket) {
    return new HttpResponse(socket);
  }
}

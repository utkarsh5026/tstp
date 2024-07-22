import { ServerResponse } from "http";
import { Cookie, CookieOptions } from "../header/cookie";
import { StatusCode } from "./status";

export class HttpResponse {
  private _res: ServerResponse;
  private _headersSent: boolean = false;
  private _statusCode: StatusCode = StatusCode.OK;
  private _headers: Record<string, string | number | string[]> = {};
  private _cookies: Cookie[] = [];

  constructor(res: ServerResponse) {
    this._res = res;
  }

  status(code: StatusCode): this {
    this._statusCode = code;
    return this;
  }

  private type(mimeType: string): this {
    return this.setHeader("Content-Type", mimeType);
  }

  setHeader(name: string, value: string | number | string[]): this {
    if (this._headersSent) throw new Error("Headers have already been sent");
    this._headers[name.toLowerCase()] = value;
    return this;
  }

  get headersSent(): boolean {
    return this._headersSent;
  }

  json(body: any): void {
    this.setHeader("Content-Type", "application/json");
    this.send(JSON.stringify(body));
  }

  html(content: string): void {
    this.type("text/html").send(content);
  }

  text(content: string): void {
    this.type("text/plain").send(content);
  }

  send(body: string | Buffer): void {
    if (this._headersSent) {
      throw new Error("Cannot send more than one response");
    }

    // Set cookies in headers
    if (this._cookies.length > 0) {
      const cookieStrings = this._cookies.map((cookie) => cookie.toString());
      this._headers["set-cookie"] = cookieStrings;
    }

    this._res.writeHead(this._statusCode, this._headers);
    this._res.end(body);
    this._headersSent = true;
  }

  redirect(url: string, status: number = 302): void {
    this.status(status).setHeader("Location", url).send("");
  }

  setCookie(name: string, value: string, options: CookieOptions = {}): this {
    const cookie = new Cookie(name, value, options);
    this._cookies.push(cookie);
    return this;
  }

  getCookie(name: string): Cookie | undefined {
    return this._cookies.find((cookie) => cookie.name === name);
  }

  clearCookie(name: string, options: CookieOptions = {}): this {
    const clearedOptions: CookieOptions = {
      ...options,
      expires: new Date(0),
      maxAge: 0,
    };
    return this.setCookie(name, "", clearedOptions);
  }

  cache(
    maxAge: number,
    options: { private?: boolean; immutable?: boolean } = {}
  ): this {
    let cacheControl = `max-age=${maxAge}`;
    if (options.private) cacheControl += ", private";
    if (options.immutable) cacheControl += ", immutable";
    return this.setHeader("Cache-Control", cacheControl);
  }

  noCache(): this {
    return this.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    )
      .setHeader("Pragma", "no-cache")
      .setHeader("Expires", "0");
  }
}

import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";
import { Cookie } from "../header/cookie";
import { HttpMethod } from "./methods";
import { parse as parseUrl } from "url";
import { HttpReqHeader } from "../header/req";

/**
 * Represents an HTTP request.
 */
export class HttpRequest {
  private _raw: IncomingMessage;
  private _body: any;
  private _query: ParsedUrlQuery;
  private _params: Record<string, string>;
  private _cookies: Map<string, Cookie> | null = null;

  /**
   * Creates an instance of HttpRequest.
   * @param req - The incoming HTTP message.
   */
  constructor(req: IncomingMessage) {
    this._raw = req;
    this._body = {};
    this._query = {};
    this._params = {};
  }

  /**
   * Gets the HTTP method of the request.
   * @returns The HTTP method.
   */
  get method(): HttpMethod {
    return (this._raw.method as HttpMethod) || HttpMethod.GET;
  }

  /**
   * Gets the URL of the request.
   * @returns The URL.
   */
  get url(): string {
    return this._raw.url ?? "/";
  }

  /**
   * Gets the body of the request.
   * @returns The body.
   */
  get body(): any {
    return this._body;
  }

  /**
   * Gets the headers of the request.
   * @returns The headers.
   */
  get headers(): Record<string, string | string[] | undefined> {
    return this._raw.headers;
  }

  /**
   * Sets the body of the request.
   * @param value - The body value to set.
   */
  set body(value: any) {
    this._body = value;
  }

  /**
   * Gets the query parameters of the request.
   * Parses the URL if the query parameters are not already set.
   * @returns The query parameters.
   */
  get query(): ParsedUrlQuery {
    if (Object.keys(this._query).length === 0) {
      const parsedUrl = parseUrl(this.url, true);
      this._query = parsedUrl.query;
    }
    return this._query;
  }

  /**
   * Checks if the request's content type matches the given type.
   * @param type - The content type to check.
   * @returns True if the content type matches, otherwise false.
   */
  is(type: string): boolean {
    const contentType = this.getHeader(HttpReqHeader.ContentType);
    if (!contentType) return false;
    return contentType.toString().toLowerCase().includes(type.toLowerCase());
  }

  /**
   * Gets a specific header from the request.
   * @param name - The name of the header.
   * @returns The header value.
   */
  getHeader(name: string): string | string[] | undefined {
    return this._raw.headers[name.toLowerCase()];
  }

  /**
   * Parses a cookie string and adds the cookies to the internal map.
   * @param cookieString - The cookie string to parse.
   */
  private parseCookieString(cookieString: string): void {
    cookieString.split(";").forEach((cookiePair) => {
      const cookie = Cookie.parse(cookiePair.trim());
      this._cookies!.set(cookie.name, cookie);
    });
  }

  /**
   * Gets the cookies from the request.
   * Parses the "Cookie" header if the cookies are not already set.
   * @returns A map of cookies.
   */
  get cookies(): Map<string, Cookie> {
    if (!this._cookies) {
      this._cookies = new Map();
      const cookieHeader = this.getHeader("Cookie");
      if (!cookieHeader) return this._cookies;
      if (Array.isArray(cookieHeader))
        cookieHeader.forEach((header) => this.parseCookieString(header));
      else this.parseCookieString(cookieHeader);
    }
    return this._cookies;
  }
}

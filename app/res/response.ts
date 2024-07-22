import { ServerResponse } from "http";
import { Cookie, CookieOptions } from "../header/cookie";
import { StatusCode } from "./status";

/**
 * Represents an HTTP response.
 */
export class HttpResponse {
  private _res: ServerResponse;
  private _headersSent: boolean = false;
  private _statusCode: StatusCode = StatusCode.OK;
  private _headers: Record<string, string | number | string[]> = {};
  private _cookies: Cookie[] = [];

  /**
   * Creates an instance of HttpResponse.
   * @param {ServerResponse} res - The server response object.
   */
  constructor(res: ServerResponse) {
    this._res = res;
  }

  /**
   * Sets the status code for the response.
   * @param {StatusCode} code - The status code to set.
   * @returns {this} The current HttpResponse instance.
   */
  status(code: StatusCode): this {
    this._statusCode = code;
    return this;
  }

  /**
   * Sets the MIME type for the response.
   * @private
   * @param {string} mimeType - The MIME type to set.
   * @returns {this} The current HttpResponse instance.
   */
  private type(mimeType: string): this {
    return this.setHeader("Content-Type", mimeType);
  }

  /**
   * Sets a header for the response.
   * @param {string} name - The name of the header.
   * @param {string | number | string[]} value - The value of the header.
   * @returns {this} The current HttpResponse instance.
   * @throws {Error} If headers have already been sent.
   */
  setHeader(name: string, value: string | number | string[]): this {
    if (this._headersSent) throw new Error("Headers have already been sent");
    this._headers[name.toLowerCase()] = value;
    return this;
  }

  /**
   * Checks if headers have been sent.
   * @returns {boolean} True if headers have been sent, otherwise false.
   */
  get headersSent(): boolean {
    return this._headersSent;
  }

  /**
   * Sends a JSON response.
   * @param {any} body - The JSON body to send.
   */
  json(body: any): void {
    this.setHeader("Content-Type", "application/json");
    this.send(JSON.stringify(body));
  }

  /**
   * Sends an HTML response.
   * @param {string} content - The HTML content to send.
   */
  html(content: string): void {
    this.type("text/html").send(content);
  }

  /**
   * Sends a plain text response.
   * @param {string} content - The plain text content to send.
   */
  text(content: string): void {
    this.type("text/plain").send(content);
  }

  /**
   * Sends the response.
   * @param {string | Buffer} body - The body of the response.
   * @throws {Error} If headers have already been sent.
   */
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

  /**
   * Redirects the response to a new URL.
   * @param {string} url - The URL to redirect to.
   * @param {number} [status=302] - The status code for the redirect.
   */
  redirect(url: string, status: number = 302): void {
    this.status(status).setHeader("Location", url).send("");
  }

  /**
   * Sets a cookie for the response.
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {CookieOptions} [options={}] - The options for the cookie.
   * @returns {this} The current HttpResponse instance.
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): this {
    const cookie = new Cookie(name, value, options);
    this._cookies.push(cookie);
    return this;
  }

  /**
   * Gets a cookie by name.
   * @param {string} name - The name of the cookie.
   * @returns {Cookie | undefined} The cookie if found, otherwise undefined.
   */
  getCookie(name: string): Cookie | undefined {
    return this._cookies.find((cookie) => cookie.name === name);
  }

  /**
   * Clears a cookie by name.
   * @param {string} name - The name of the cookie.
   * @param {CookieOptions} [options={}] - The options for clearing the cookie.
   * @returns {this} The current HttpResponse instance.
   */
  clearCookie(name: string, options: CookieOptions = {}): this {
    const clearedOptions: CookieOptions = {
      ...options,
      expires: new Date(0),
      maxAge: 0,
    };
    return this.setCookie(name, "", clearedOptions);
  }

  /**
   * Sets cache control headers.
   * @param {number} maxAge - The max age for the cache.
   * @param {Object} [options={}] - Additional cache options.
   * @param {boolean} [options.private] - Whether the cache is private.
   * @param {boolean} [options.immutable] - Whether the cache is immutable.
   * @returns {this} The current HttpResponse instance.
   */
  cache(
    maxAge: number,
    options: { private?: boolean; immutable?: boolean } = {}
  ): this {
    let cacheControl = `max-age=${maxAge}`;
    if (options.private) cacheControl += ", private";
    if (options.immutable) cacheControl += ", immutable";
    return this.setHeader("Cache-Control", cacheControl);
  }

  /**
   * Sets headers to prevent caching.
   * @returns {this} The current HttpResponse instance.
   */
  noCache(): this {
    return this.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    )
      .setHeader("Pragma", "no-cache")
      .setHeader("Expires", "0");
  }
}

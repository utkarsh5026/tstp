export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Class representing a cookie with various options.
 */
export class Cookie {
  private _name: string;
  private _value: string;
  private _options: CookieOptions;

  /**
   * Create a new Cookie instance.
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {CookieOptions} [options={}] - Optional settings for the cookie.
   */
  constructor(name: string, value: string, options: CookieOptions = {}) {
    this._name = name;
    this._value = value;
    this._options = options;
  }

  /**
   * Get the name of the cookie.
   * @return {string} The name of the cookie.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get the value of the cookie.
   * @return {string} The value of the cookie.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Set a new value for the cookie.
   * @param {string} newValue - The new value of the cookie.
   */
  set value(newValue: string) {
    this._value = newValue;
  }

  /**
   * Get the options of the cookie.
   * @return {CookieOptions} The options of the cookie.
   */
  get options(): CookieOptions {
    return this._options;
  }

  /**
   * Set new options for the cookie.
   * @param {CookieOptions} newOptions - The new options for the cookie.
   */
  set options(newOptions: CookieOptions) {
    this._options = { ...this._options, ...newOptions };
  }

  /**
   * Convert the cookie to a string suitable for a HTTP header.
   * @return {string} The cookie as a string.
   */
  toString(): string {
    let cookieString = `${this._name}=${encodeURIComponent(this._value)}`;

    if (this._options.maxAge)
      cookieString += `; Max-Age=${this._options.maxAge}`;
    if (this._options.expires)
      cookieString += `; Expires=${this._options.expires.toUTCString()}`;
    if (this._options.httpOnly) cookieString += "; HttpOnly";
    if (this._options.secure) cookieString += "; Secure";
    if (this._options.domain)
      cookieString += `; Domain=${this._options.domain}`;
    if (this._options.path) cookieString += `; Path=${this._options.path}`;
    if (this._options.sameSite)
      cookieString += `; SameSite=${this._options.sameSite}`;

    return cookieString;
  }

  /**
   * Parse a cookie string and return a Cookie instance.
   * @param {string} cookieString - The cookie string to parse.
   * @return {Cookie} A new Cookie instance.
   */
  static parse(cookieString: string): Cookie {
    const [nameValue, ...parts] = cookieString.split(";");
    const [name, value] = nameValue.split("=").map((s) => s.trim());

    const options: CookieOptions = {};
    parts.forEach((part) => {
      const [key, val] = part.split("=").map((s) => s.trim());
      switch (key.toLowerCase()) {
        case "max-age":
          options.maxAge = parseInt(val);
          break;
        case "expires":
          options.expires = new Date(val);
          break;
        case "httponly":
          options.httpOnly = true;
          break;
        case "secure":
          options.secure = true;
          break;
        case "domain":
          options.domain = val;
          break;
        case "path":
          options.path = val;
          break;
        case "samesite":
          options.sameSite = val as "Strict" | "Lax" | "None";
          break;
      }
    });

    return new Cookie(name, decodeURIComponent(value), options);
  }
}

import { HttpResponse } from "../app/res/response";
import { ServerResponse } from "http";
import { StatusCode } from "../app/res/status";
import { Cookie, CookieOptions } from "../app/header/cookie";

// Mock ServerResponse
class MockServerResponse {
  statusCode: number = 200;
  headers: Record<string, string | number | string[]> = {};
  body: string | Buffer = "";
  ended: boolean = false;

  writeHead(
    statusCode: number,
    headers: Record<string, string | number | string[]>
  ) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  end(body: string | Buffer) {
    this.body = body;
    this.ended = true;
  }
}

describe("HttpResponse", () => {
  let mockRes: MockServerResponse;
  let response: HttpResponse;

  beforeEach(() => {
    mockRes = new MockServerResponse();
    response = new HttpResponse(mockRes as unknown as ServerResponse);
  });

  test("status sets the correct status code", () => {
    response.status(StatusCode.CREATED);
    response.send("");
    expect(mockRes.statusCode).toBe(StatusCode.CREATED);
  });

  test("setHeader sets a header correctly", () => {
    response.setHeader("X-Test", "value");
    response.send("");
    expect(mockRes.headers["x-test"]).toBe("value");
  });

  test("headersSent returns false before sending", () => {
    expect(response.headersSent).toBe(false);
  });

  test("headersSent returns true after sending", () => {
    response.send("");
    expect(response.headersSent).toBe(true);
  });

  test("json sends JSON response", () => {
    const data = { key: "value" };
    response.json(data);
    expect(mockRes.headers["content-type"]).toBe("application/json");
    expect(mockRes.body).toBe(JSON.stringify(data));
  });

  test("html sends HTML response", () => {
    const html = "<h1>Hello</h1>";
    response.html(html);
    expect(mockRes.headers["content-type"]).toBe("text/html");
    expect(mockRes.body).toBe(html);
  });

  test("text sends plain text response", () => {
    const text = "Hello, world!";
    response.text(text);
    expect(mockRes.headers["content-type"]).toBe("text/plain");
    expect(mockRes.body).toBe(text);
  });

  test("send throws error when called twice", () => {
    response.send("First");
    expect(() => response.send("Second")).toThrow(
      "Cannot send more than one response"
    );
  });

  test("redirect sets correct status and location", () => {
    response.redirect("/new-location", StatusCode.TEMPORARY_REDIRECT);
    expect(mockRes.statusCode).toBe(StatusCode.TEMPORARY_REDIRECT);
    expect(mockRes.headers["location"]).toBe("/new-location");
  });

  test("setCookie adds a cookie", () => {
    response.setCookie("session", "abc123", { httpOnly: true });
    response.send("");
    expect(mockRes.headers["set-cookie"]).toContain("session=abc123; HttpOnly");
  });

  test("getCookie retrieves a set cookie", () => {
    response.setCookie("session", "abc123");
    const cookie = response.getCookie("session");
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe("abc123");
  });

  test("clearCookie clears a cookie", () => {
    response.clearCookie("session");
    response.send("");
    expect(mockRes.headers["set-cookie"]).toContain(
      "session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0"
    );
  });

  test("cache sets correct cache control headers", () => {
    response.cache(3600, { private: true, immutable: true });
    response.send("");
    expect(mockRes.headers["cache-control"]).toBe(
      "max-age=3600, private, immutable"
    );
  });

  test("noCache sets correct no-cache headers", () => {
    response.noCache();
    response.send("");
    expect(mockRes.headers["cache-control"]).toBe(
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    expect(mockRes.headers["pragma"]).toBe("no-cache");
    expect(mockRes.headers["expires"]).toBe("0");
  });

  test("chaining methods works correctly", () => {
    response
      .status(StatusCode.OK)
      .setHeader("X-Custom", "value")
      .setCookie("session", "abc123")
      .send("Hello");

    expect(mockRes.statusCode).toBe(StatusCode.OK);
    expect(mockRes.headers["x-custom"]).toBe("value");
    expect(mockRes.headers["set-cookie"]).toContain("session=abc123");
    expect(mockRes.body).toBe("Hello");
  });

  test("setHeader throws error after headers sent", () => {
    response.send("");
    expect(() => response.setHeader("X-Late", "too late")).toThrow(
      "Headers have already been sent"
    );
  });
});

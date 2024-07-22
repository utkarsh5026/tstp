import { IncomingMessage } from "http";
import { HttpRequest } from "../app/req/request";
import { HttpMethod } from "../app/req/methods";

describe("HttpRequest", () => {
  let mockIncomingMessage: IncomingMessage;

  beforeEach(() => {
    mockIncomingMessage = {
      headers: {},
      method: "GET",
      url: "/",
    } as IncomingMessage;
  });

  it("should create an HttpRequest instance", () => {
    const req = new HttpRequest(mockIncomingMessage);
    expect(req).toBeInstanceOf(HttpRequest);
  });

  it("should return the correct HTTP method", () => {
    mockIncomingMessage.method = "POST";
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.method).toBe(HttpMethod.POST);
  });

  it("should return the correct URL", () => {
    mockIncomingMessage.url = "/test";
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.url).toBe("/test");
  });

  it("should return the body", () => {
    const req = new HttpRequest(mockIncomingMessage);
    req.body = { key: "value" };
    expect(req.body).toEqual({ key: "value" });
  });

  it("should return the query parameters", () => {
    mockIncomingMessage.url = "/test?param1=value1&param2=value2";
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.query).toEqual({ param1: "value1", param2: "value2" });
  });

  it("should identify the content type", () => {
    mockIncomingMessage.headers["content-type"] = "application/json";
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.is("application/json")).toBe(true);
    expect(req.is("text/html")).toBe(false);
  });

  it("should get header value", () => {
    mockIncomingMessage.headers["x-test-header"] = "test-value";
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.getHeader("x-test-header")).toBe("test-value");
  });

  it("should parse cookies from the header", () => {
    mockIncomingMessage.headers["cookie"] = "cookie1=value1; cookie2=value2";
    const req = new HttpRequest(mockIncomingMessage);
    const cookies = req.cookies;
    expect(cookies.size).toBe(2);
    expect(cookies.get("cookie1")?.value).toBe("value1");
    expect(cookies.get("cookie2")?.value).toBe("value2");
  });

  it("should handle no cookies header", () => {
    const req = new HttpRequest(mockIncomingMessage);
    expect(req.cookies.size).toBe(0);
  });

  it("should handle multiple Set-Cookie headers", () => {
    mockIncomingMessage.headers["cookie"] = [
      "cookie1=value1",
      "cookie2=value2",
    ].join("; ");
    const req = new HttpRequest(mockIncomingMessage);
    const cookies = req.cookies;
    expect(cookies.size).toBe(2);
    expect(cookies.get("cookie1")?.value).toBe("value1");
    expect(cookies.get("cookie2")?.value).toBe("value2");
  });

  it("should set new body value", () => {
    const req = new HttpRequest(mockIncomingMessage);
    req.body = { newKey: "newValue" };
    expect(req.body).toEqual({ newKey: "newValue" });
  });

  it("should update the query object correctly", () => {
    mockIncomingMessage.url = "/test?param1=value1";
    const req = new HttpRequest(mockIncomingMessage);

    expect(req.query).toEqual({ param1: "value1" });
  });
});

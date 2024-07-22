import { Cookie, CookieOptions } from "../app/header/cookie";

describe("Cookie", () => {
  it("should create a cookie with given name and value", () => {
    const cookie = new Cookie("testName", "testValue");
    expect(cookie.name).toBe("testName");
    expect(cookie.value).toBe("testValue");
  });

  it("should set and get cookie options", () => {
    const options: CookieOptions = {
      maxAge: 3600,
      expires: new Date("2024-12-31T23:59:59.000Z"),
      httpOnly: true,
      secure: true,
      domain: "example.com",
      path: "/",
      sameSite: "Strict",
    };
    const cookie = new Cookie("testName", "testValue", options);
    expect(cookie.options).toEqual(options);
  });

  it("should update cookie value", () => {
    const cookie = new Cookie("testName", "testValue");
    cookie.value = "newValue";
    expect(cookie.value).toBe("newValue");
  });

  it("should update cookie options", () => {
    const initialOptions: CookieOptions = { maxAge: 3600 };
    const newOptions: CookieOptions = { httpOnly: true, secure: true };
    const cookie = new Cookie("testName", "testValue", initialOptions);
    cookie.options = newOptions;
    expect(cookie.options).toEqual({ ...initialOptions, ...newOptions });
  });

  it("should convert cookie to string", () => {
    const options: CookieOptions = {
      maxAge: 3600,
      expires: new Date("2024-12-31T23:59:59.000Z"),
      httpOnly: true,
      secure: true,
      domain: "example.com",
      path: "/",
      sameSite: "Strict",
    };
    const cookie = new Cookie("testName", "testValue", options);
    const cookieString = cookie.toString();
    expect(cookieString).toContain("testName=testValue");
    expect(cookieString).toContain("Max-Age=3600");
    expect(cookieString).toContain("Expires=Tue, 31 Dec 2024 23:59:59 GMT");
    expect(cookieString).toContain("HttpOnly");
    expect(cookieString).toContain("Secure");
    expect(cookieString).toContain("Domain=example.com");
    expect(cookieString).toContain("Path=/");
    expect(cookieString).toContain("SameSite=Strict");
  });

  it("should parse cookie string", () => {
    const cookieString =
      "testName=testValue; Max-Age=3600; Expires=Tue, 31 Dec 2024 23:59:59 GMT; HttpOnly; Secure; Domain=example.com; Path=/; SameSite=Strict";
    const cookie = Cookie.parse(cookieString);
    expect(cookie.name).toBe("testName");
    expect(cookie.value).toBe("testValue");
    expect(cookie.options.maxAge).toBe(3600);
    expect(cookie.options.expires?.toUTCString()).toBe(
      "Tue, 31 Dec 2024 23:59:59 GMT"
    );
    expect(cookie.options.httpOnly).toBe(true);
    expect(cookie.options.secure).toBe(true);
    expect(cookie.options.domain).toBe("example.com");
    expect(cookie.options.path).toBe("/");
    expect(cookie.options.sameSite).toBe("Strict");
  });
});

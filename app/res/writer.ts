export class ResponseWriter {
  private parts: string[] = [];

  writeString(str: string) {
    this.parts.push(str);
    this.parts.push("\r\n");
  }

  writeBody(body: string) {
    this.parts.push(body);
  }

  writeHeaders(headers: Record<string, string | number>) {
    const headerStrings = Object.entries(headers).map(
      ([key, value]) => `${key}: ${value}`
    );
    this.parts.push(headerStrings.join("\r\n"));
    this.parts.push("\r\n\r\n");
  }

  toString(): string {
    return this.parts.join("");
  }

  clear() {
    this.parts = [];
  }
}

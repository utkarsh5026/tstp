import * as path from "path";
import { HttpResponse, StatusCode, HTTP_VERSION } from "./response";
import { HttpRequest } from "./request";
import { readFromFile } from "./file";

export const createResponseForEcho = (req: HttpRequest): HttpResponse => {
  const path = req.path;
  const echoPath = path.split("/").pop() || "";
  const length = echoPath.length.toString();
  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };
  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, echoPath);
};

export const createUserAgentResponse = (req: HttpRequest): HttpResponse => {
  const body = req.headers["User-Agent"] || "";
  const length = body.length.toString();

  console.log(req.headers);

  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };

  console.log(body + " " + length);

  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, body);
};

export const createFileContentsResponse = async (
  filePath: string
): Promise<HttpResponse> => {
  const fileName = filePath.split("/").pop() || "";
  filePath = path.join(".", filePath, fileName);

  console.log(__dirname, filePath);
  const body = await readFromFile(filePath);
  const length = body.length.toString();
  const headers = {
    "Content-Type": "application/octet-stream",
    "Content-Length": length,
  };

  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, body);
};

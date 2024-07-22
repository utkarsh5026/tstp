import * as path from "path";
import { HttpResponse } from "./res/response";
import { StatusCode } from "./res/status";
import { HttpRequest } from "./req/request";
import { readFromFile, writeToFile } from "./file";
import { handleEncoding } from "./header/handle";

export const createResponseForEcho = (req: HttpRequest, res: HttpResponse) => {
  const path = req.path;
  const echoPath = path.split("/").pop() ?? "";
  const length = echoPath.length.toString();
  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };

  res.setBody(echoPath);
  handleEncoding(req, res);
  res.send(StatusCode.OK, res.getBody(), headers);
};

export const createUserAgentResponse = (
  req: HttpRequest,
  res: HttpResponse
) => {
  const body = req.headers["User-Agent"] || "";
  const length = body.length.toString();
  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };

  res.send(StatusCode.OK, body, headers);
};

export const createFileContentsResponse = async (
  filePath: string,
  req: HttpRequest,
  res: HttpResponse
) => {
  const fileName = req.path.split("/").pop() || "";
  filePath = path.join(filePath, fileName);
  const body = await readFromFile(filePath);
  const length = body.length.toString();

  if (length === "0") res.send(StatusCode.NOT_FOUND, "");
  const headers = {
    "Content-Type": "application/octet-stream",
    "Content-Length": length,
  };

  res.send(StatusCode.OK, body, headers);
};

export const saveFile = async (
  req: HttpRequest,
  res: HttpResponse,
  filePath: string
) => {
  const fileName = req.path.split("/").pop() || "";
  const contents = req.body;

  filePath = path.join(filePath, fileName);
  await writeToFile(filePath, contents);
  res.send(StatusCode.CREATED, "");
};

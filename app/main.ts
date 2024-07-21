import * as net from "net";
import { HttpResponse, StatusCode } from "./response";
import { HttpRequest } from "./request";

const HTTP_VERSION = "HTTP/1.1";

const createResponseForEcho = (req: HttpRequest): HttpResponse => {
  const path = req.path;
  const echoPath = path.split("/").pop() || "";
  const length = echoPath.length.toString();
  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };
  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, echoPath);
};

const createUserAgentResponse = (req: HttpRequest): HttpResponse => {
  const body = req.headers["User-Agent"] || "";
  const length = body.length.toString();

  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };

  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, body);
};

const createResponse = (req: HttpRequest): HttpResponse => {
  if (req.path.startsWith("/user-agent")) return createUserAgentResponse(req);
  if (req.path.startsWith("/echo")) return createResponseForEcho(req);
  if (req.path === "/")
    return new HttpResponse(HTTP_VERSION, StatusCode.OK, {}, "");
  return new HttpResponse(HTTP_VERSION, StatusCode.NOT_FOUND, {}, "");
};
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = HttpRequest.fromBuffer(data);
    const res = createResponse(req);
    console.log(res.toString());
    socket.write(res.toString());
    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

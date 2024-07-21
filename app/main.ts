import * as net from "net";
import { HttpResponse, StatusCode } from "./response";
import { HttpRequest } from "./request";

const HTTP_VERSION = "HTTP/1.1";

const createResponse = (req: HttpRequest): HttpResponse => {
  const path = req.path;
  const badPath = !path.startsWith("/echo/");

  if (badPath)
    return new HttpResponse(HTTP_VERSION, StatusCode.NOT_FOUND, {}, "");

  const echoPath = path.split("/").pop() || "";
  const length = echoPath.length.toString();
  const headers = {
    "Content-Type": "text/plain",
    "Content-Length": length,
  };
  return new HttpResponse(HTTP_VERSION, StatusCode.OK, headers, echoPath);
};

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = HttpRequest.fromBuffer(data);
    const res = createResponse(req);
    console.log(res);
    socket.write(res.toString());
    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

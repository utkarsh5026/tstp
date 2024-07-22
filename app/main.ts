import * as net from "net";
import { HttpResponse } from "./res/response";
import { HttpRequest, HttpMethod } from "./req/request";
import { StatusCode } from "./res/status";
import {
  createResponseForEcho,
  createUserAgentResponse,
  createFileContentsResponse,
  saveFile,
} from "./handlers";

const FILE_PATH = process.argv.length == 4 ? process.argv[3] : "";

const sendResponse = async (req: HttpRequest, res: HttpResponse) => {
  switch (true) {
    case req.path.startsWith("/file") && req.method === HttpMethod.GET:
      console.log("Getting file");
      await createFileContentsResponse(FILE_PATH, req, res);
      break;
    case req.path.startsWith("/file") && req.method === HttpMethod.POST:
      console.log("Saving file");
      await saveFile(req, res, FILE_PATH);
      break;
    case req.path.startsWith("/user-agent"):
      createUserAgentResponse(req, res);
      break;
    case req.path.startsWith("/echo"):
      createResponseForEcho(req, res);
      break;
    case req.path === "/":
      res.send(StatusCode.OK, "");
      break;
    default:
      res.send(StatusCode.NOT_FOUND, "");
  }
};
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", async (data) => {
    const req = HttpRequest.fromBuffer(data);
    const res = HttpResponse.initialize(socket);
    sendResponse(req, res);
    socket.end();
  });
});

console.log(FILE_PATH);

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

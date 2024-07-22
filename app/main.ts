import * as net from "net";
import { HttpResponse, StatusCode, HTTP_VERSION } from "./res/response";
import { HttpRequest, HttpMethod } from "./req/request";
import { handleEncoding, handleContentLength } from "./header/handle";
import {
  createResponseForEcho,
  createUserAgentResponse,
  createFileContentsResponse,
  saveFile,
} from "./handlers";

console.log(process.argv);
const FILE_PATH = process.argv.length == 4 ? process.argv[3] : "";

const createResponse = async (req: HttpRequest): Promise<HttpResponse> => {
  switch (true) {
    case req.path.startsWith("/file") && req.method === HttpMethod.GET:
      return await createFileContentsResponse(FILE_PATH, req);
    case req.path.startsWith("/file") && req.method === HttpMethod.POST:
      return await saveFile(req, FILE_PATH);
    case req.path.startsWith("/user-agent"):
      return createUserAgentResponse(req);
    case req.path.startsWith("/echo"):
      return createResponseForEcho(req);
    case req.path === "/":
      return new HttpResponse(HTTP_VERSION, StatusCode.OK, {}, "");
    default:
      return new HttpResponse(HTTP_VERSION, StatusCode.NOT_FOUND, {}, "");
  }
};
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", async (data) => {
    const req = HttpRequest.fromBuffer(data);
    const res = await createResponse(req);

    console.log(res);
    handleEncoding(req, res);
    handleContentLength(req, res);

    socket.write(res.toString());
    socket.end();
  });
});

console.log(FILE_PATH);

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

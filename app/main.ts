import * as net from "net";
import { HttpResponse, StatusCode, HTTP_VERSION } from "./response";
import { HttpRequest } from "./request";
import {
  createResponseForEcho,
  createUserAgentResponse,
  createFileContentsResponse,
} from "./handlers";

console.log(process.argv);
const FILE_PATH = process.argv.length == 4 ? process.argv[3] : "";

const createResponse = async (req: HttpRequest): Promise<HttpResponse> => {
  if (req.path.startsWith("/file"))
    return await createFileContentsResponse(FILE_PATH);
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

  socket.on("data", async (data) => {
    const req = HttpRequest.fromBuffer(data);
    const res = await createResponse(req);
    console.log(res.toString());
    socket.write(res.toString());
    socket.end();
  });
});

console.log(FILE_PATH);

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

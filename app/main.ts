import * as net from "net";

console.log("Logs from your program will appear here!");

const StatusCode: { [key: number]: string } = {
  200: "OK",
  404: "Not Found",
};

interface Request {
  method: string;
  path: string;
  headers: Record<string, string | number>;
  body: string;
}

interface Response {
  httpVersion: string;
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const parseRequest = (data: Buffer): Request => {
  const parts = data.toString().split("\n");
  const [method, path] = parts[0].split(" ");

  return {
    method,
    path,
    headers: {},
    body: "",
  };
};

const createResponse = (req: Request): Response => {
  const path = req.path;
  const badPath = !path.startsWith("/echo/");

  if (badPath)
    return {
      httpVersion: "1.1",
      statusCode: 404,
      headers: {},
      body: "",
    };

  const echoPath = path.split("/").pop();
  const length = echoPath ? echoPath.length.toString() : "0";
  return {
    httpVersion: "HTTP/1.1",
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Length": length,
    },
    body: echoPath ? echoPath : "",
  };
};

const makeResponseString = (res: Response): string => {
  const response = [];
  const status = `${res.httpVersion} ${res.statusCode} ${
    StatusCode[res.statusCode]
  }\r\n`;

  const headers = Object.entries(res.headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\r\n");

  response.push(status);
  response.push(headers);
  response.push(res.body);
  return response.join("\r\n");
};

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = parseRequest(data);
    const res = createResponse(req);

    const response = makeResponseString(res);

    socket.write(response);
    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

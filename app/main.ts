import * as net from "net";

console.log("Logs from your program will appear here!");

interface Request {
  method: string;
  path: string;
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

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = parseRequest(data);
    const paths = req.path.split("/");
    const echoPath = paths[paths.length - 1];

    socket.write(`HTTP/1.1 200 OK\r\n`);
    socket.write(`Content-Type: text/plain\r\n`);
    socket.write(`Content-Length: ${echoPath.length}\r\n`);
    socket.write(`\r\n`);
    socket.write(echoPath);
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

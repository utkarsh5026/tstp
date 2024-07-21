import * as net from "net";

console.log("Logs from your program will appear here!");

const isGoodPath = (data: Buffer): boolean => {
  const req = data.toString();
  const parts = req.split("\r\n");
  const method = parts[0];
  const path = method.split(" ")[1];
  return path === "/";
};

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const goodPath = isGoodPath(data);
    const resp = goodPath
      ? `HTTP/1.1 200 OK\r\n\r\n`
      : `HTTP/1.1 404 Not Found\r\n\r\n`;
    socket.write(resp);

    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on http://localhost:4221");
});

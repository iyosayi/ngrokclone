// src/index.ts
import http from "http";
import { WebSocketServer } from "ws";
import {
  decode,
  encode
} from "@ngrokclone/proto";
var PORT = 4e3;
var httpServer = http.createServer((_req, res) => {
  res.writeHead(200).end("Tunnel server alive");
});
var wss = new WebSocketServer({ server: httpServer, path: "/tunnel" });
var registry = /* @__PURE__ */ new Map();
wss.on("connection", (socket) => {
  socket.once("message", (raw) => {
    const msg = decode(raw.toString());
    if (msg.t !== "reg") {
      socket.close(1002, "First message must be Register");
      return;
    }
    handleRegister(msg, socket);
  });
});
function handleRegister(msg, socket) {
  const { sub } = msg;
  if (registry.has(sub)) {
    socket.close(4001, "Subdomain already taken");
    return;
  }
  registry.set(sub, socket);
  const ack = {
    t: "ack",
    sub,
    publicUrl: `https://${sub}.myngrok.dev`
  };
  socket.send(encode(ack));
  console.log(`\u2714\uFE0E tunnel registered: ${sub}`);
  socket.on("close", () => registry.delete(sub));
}
httpServer.listen(
  PORT,
  () => console.log(`HTTP+WS tunnel server listening on :${PORT}`)
);

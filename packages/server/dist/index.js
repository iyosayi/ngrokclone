var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_http = __toESM(require("http"));
var import_ws = require("ws");
var import_proto = require("@ngrokclone/proto");
var PORT = 4e3;
var httpServer = import_http.default.createServer((_req, res) => {
  res.writeHead(200).end("Tunnel server alive");
});
var wss = new import_ws.WebSocketServer({ server: httpServer, path: "/tunnel" });
var registry = /* @__PURE__ */ new Map();
wss.on("connection", (socket) => {
  socket.once("message", (raw) => {
    const msg = (0, import_proto.decode)(raw.toString());
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
  socket.send((0, import_proto.encode)(ack));
  console.log(`\u2714\uFE0E tunnel registered: ${sub}`);
  socket.on("close", () => registry.delete(sub));
}
httpServer.listen(
  PORT,
  () => console.log(`HTTP+WS tunnel server listening on :${PORT}`)
);

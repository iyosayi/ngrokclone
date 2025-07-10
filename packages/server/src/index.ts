import http from 'http';
import { WebSocketServer, type WebSocket } from 'ws';
import {
    decode,
    encode,
    Register, Ack, Message,
} from '@ngrokclone/proto';

const PORT = 4000;

// ➊ create plain HTTP server (needed for Ws upgrade)
const httpServer = http.createServer((_req, res) => {
    res.writeHead(200).end('Tunnel server alive');
});

// ➋ attach WebSocketServer
const wss = new WebSocketServer({ server: httpServer, path: '/tunnel' });

// ➌ in-memory subdomain → socket map
const registry = new Map<string, WebSocket>();

wss.on('connection', (socket) => {
    socket.once('message', (raw) => {
        // first frame **must** be Register
        const msg: Message = decode(raw.toString());

        if (msg.t !== 'reg') {
            socket.close(1002, 'First message must be Register');
            return;
        }

        handleRegister(msg, socket);
    });
});

function handleRegister(msg: Register, socket: WebSocket) {
    const { sub } = msg;

    if (registry.has(sub)) {
        socket.close(4001, 'Subdomain already taken');
        return;
    }

    registry.set(sub, socket);

    // build Ack
    const ack: Ack = {
        t: 'ack',
        sub,
        publicUrl: `https://${sub}.myngrok.dev`,
    };

    socket.send(encode(ack));
    console.log(`✔︎ tunnel registered: ${sub}`);

    // tidy up on disconnect
    socket.on('close', () => registry.delete(sub));
}

httpServer.listen(PORT, () =>
    console.log(`HTTP+WS tunnel server listening on :${PORT}`)
);

# NgrokClone – Local Tunnel Service (Node.js + TypeScript Monorepo)

A from-scratch, open-source alternative to **Ngrok** that lets you expose any
local port to the public internet through a secure, long-lived tunnel.  

The goal is to serve as both a learning playground (deep dive into networking,
WebSockets, reverse proxying) and a (maybe) production-grade tool you can use every day.

---

## ✨  Key Features (MVP v0)

- **Bidirectional WebSocket tunnel** between a public gateway and a local agent
- **Sub-domain routing** (`https://<your-alias>.myngrok.dev`)
- **Request ↔ response correlation** with ULID IDs
- **Monorepo** with shared protocol package (`proto`), server, and client
- **Strict TypeScript**, Vitest tests, ESLint + Prettier, Turbo build graph


---

## 🚀 Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | ≥ 18 LTS (tested on 20) | ES2022 features |
| **pnpm** | ≥ 10.12 | Workspace manager |
| **Turbo** | declared in `devDependencies` | Graph-aware task runner |

---

## 🔧 Bootstrap

```bash
# clone & enter
git clone https://github.com/iyosayi/ngrokclone.git
cd ngrokclone

# install all workspace deps (one shot)
pnpm install
```
> Tip: the first install seeds the .pnpm-store; subsequent installs are fast.

---

## 🏃‍♂️ Development Workflow

### 1 – Start Everything (watch mode)

```bash
pnpm dev
```

Turbo runs each package’s local dev script in topological order and hot-restarts on file changes.

### 2 – Start a Single Package
```bash
pnpm --filter @mynngrok/server dev    # gateway only
pnpm --filter @mynngrok/client dev    # local agent only
```

### 3 – Hit the WebSocket Handshake Manually
```bash
# ensure the server is running on port 4000
npx wscat -c ws://localhost:4000/tunnel
> {"t":"reg","sub":"demo","version":1}
< {"t":"ack","sub":"demo","publicUrl":"https://demo.myngrok.dev"}
```

---

## 🧪 Testing
```bash
pnpm test         # one-off run
pnpm test --watch # watch mode
```

Vitest picks up all *.test.ts under packages/**/src/.

Coverage reports land in coverage/ (thresholds enforced in CI).

---

## 🛠 Useful Scripts (root package.json)

| Script         | What it does                            |
| -------------- | --------------------------------------- |
| `pnpm dev`     | `turbo run dev` → parallel watch builds |
| `pnpm build`   | `turbo run build` → production bundles  |
| `pnpm lint`    | ESLint across repo                      |
| `pnpm format`  | Prettier write                          |
| `pnpm test`    | `turbo run test` → Vitest               |
| `pnpm prepare` | installs Husky git hooks                |


---
## 📚 Learning Goals
1. **Low-level networking** – WebSocket frames, keep-alive, back-pressure

2. **Node.js internals** – net streams, event-loop concurrency

3. **Robust design** – protocol versioning, graceful reconnects, auth, TLS

4. **Polyglot rewrite** – port the client to Go or Python once Node MVP is solid

---

## 🤝 Contributing
PRs, issues, and discussion are welcome!
Before submitting, please:

1. Run `pnpm lint && pnpm test.`

2. Follow the conventional-commit guidelines (Changesets automates version bumps).
---

## 📄 License
MIT © 2025 King Etiosasere / @iyosayi


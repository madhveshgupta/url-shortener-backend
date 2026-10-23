# Scalable URL Shortener & Click Telemetry API

A fast, lightweight REST API built with **Node.js, Express.js, and MongoDB (Mongoose)** that converts long URLs (up to 2048 characters) into collision-free 6-character **Base62** short codes, handles **HTTP 302** redirections, and tracks real-time click telemetry using atomic database operations.

---

## Tech Stack
- **Runtime & Framework:** Node.js (ES Modules), Express.js
- **Database:** MongoDB, Mongoose
- **Code Generation:** Node.js built-in `crypto` module (`crypto.randomBytes`)

---

## Core Engineering Highlights
1. **Base62 Short Code Generation (`56.8B` Combinations):** Uses `crypto.randomBytes(6)` mapped across `a-z`, `A-Z`, and `0-9` ($62^6 \approx 56.8 \times 10^9$ possible codes) with collision checking before insertion.
2. **Unique B-Tree Indexing:** Enforces `unique: true` on `shortCode` in the Mongoose schema so MongoDB executes $O(\log N)$ `IXSCAN` lookups instead of full collection scans (`COLLSCAN`).
3. **Concurrency-Safe Click Tracking (`$inc`):** Uses `findOneAndUpdate({ shortCode: code }, { $inc: { clicks: 1 } })` to atomically increment visit counters inside the database engine, preventing race conditions under simultaneous traffic.
4. **HTTP 302 Temporary Redirection:** Explicitly responds with status `302` instead of `301` (Permanent Redirect) so browsers do not cache the redirect locally and bypass click telemetry on repeat visits.
5. **Protocol Whitelisting:** Validates that incoming URLs strictly begin with `http://` or `https://` and parse cleanly via `new URL()`, blocking `javascript:` XSS payloads.

---

## Project Structure
```text
├── src/
│   ├── app/
│   │   └── app.js
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   ├── models/
│   │   └── url.model.js
│   ├── routes/
│   │   └── url.routes.js
│   ├── utils/
│   │   └── generateCode.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/url` | `{ "url": "https://example.com" }` | Validate long URL and generate a 6-character short code |
| `GET` | `/api/url` | None | Retrieve all shortened URLs sorted newest first |
| `GET` | `/:code` | None | Increment `clicks` atomically (`$inc`) and redirect (`302`) to `originalUrl` |
| `DELETE` | `/api/url/:id` | None | Delete a shortened URL document by its MongoDB `_id` |

---

## Local Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

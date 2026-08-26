# Email Gateway

A lightweight Node + Express + TypeScript service that sends **one email per request**, with optional file attachments. No database, no auth server — a single API-key-protected endpoint over Nodemailer, organized into small functional modules (bootstrap / app / config / middleware / routes / mailer / utils).

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
```

| Var | Purpose |
|-----|---------|
| `PORT` | HTTP port (default 3000) |
| `EMAIL_HOST` / `EMAIL_PORT` | SMTP host/port (Gmail: `smtp.gmail.com` / `587`) |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP user + **Gmail App Password** |
| `DEFAULT_FROM_NAME` | Sender display name |
| `DEFAULT_REPLY_TO` | Optional reply-to address |
| `API_KEY` | Shared key required in the `x-api-key` header |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in ms (default 60000) |
| `RATE_LIMIT_MAX` | Max requests per window per IP (default 20) |

`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `API_KEY` are **required** — the server validates them and verifies the SMTP connection at startup, exiting if either fails.

## Run

```bash
npm run dev      # ts-node, no build
npm run build    # tsc -> dist/
npm start        # node dist/index.js
```

## API

### `GET /health`
Open, unauthenticated. Returns `{ success: true, status: "ok" }`.

### `POST /send`
Requires header `x-api-key: <API_KEY>`. Accepts **`multipart/form-data`** (with files) or **`application/json`** (no files).

| Field | Required | Notes |
|-------|----------|-------|
| `to` | yes | single recipient email |
| `subject` | yes | |
| `html` | no | custom HTML design; if omitted, a minimal default template is used |
| `text` | no | plain-text version |
| `cc`, `bcc` | no | string, repeated field, or JSON-array string |
| `files` | no | up to 5 attachments, 10 MB each; allowed: pdf, csv, xlsx, docx, jpg, jpeg, png |

**Success:** `200 { success: true, messageId }`
**Errors:** `400` validation · `401` bad/missing API key · `429` rate limited · `500` send failure

### Examples

JSON (no attachment):

```bash
curl -X POST http://localhost:3000/send \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"john@example.com","subject":"Hello","text":"Hi there"}'
```

With an attachment:

```bash
curl -X POST http://localhost:3000/send \
  -H "x-api-key: YOUR_KEY" \
  -F "to=john@example.com" \
  -F "subject=Report" \
  -F "text=See attached" \
  -F "files=@./report.pdf"
```

## Structure

```
src/
  index.ts            # bootstrap: validate env, verify SMTP, start server, graceful shutdown
  app.ts              # assembles the Express app (middleware + routes)
  config/constants.ts # attachment rules
  middleware/         # apiKey (constant-time), rateLimit (env-driven), errorHandler
  routes/             # health.route, email.route
  mailer/             # mailer (transporter + sendMail + verify), template, types
  utils/              # http (fail/ok helpers), validation (isEmail, toArray)
```

> Server-to-server only. Do not call this from a browser — the API key would be exposed.

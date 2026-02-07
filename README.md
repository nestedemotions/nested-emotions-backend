# Nested Emotions Backend

A simple backend API for storing and retrieving emotions.

This service is built as part of the Nested Emotions project and provides
basic endpoints to add emotions and fetch stored emotions from a database.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Render

---

## Base URL

https://nested-emotions-backend.onrender.com

---

## API Endpoints

### Health Check

**GET** `/health`

Response:
```json
{
  "status": "ok",
  "db": "connected"
}


---

### 4️⃣ Add the other two endpoints (to match your backend)

Paste **below** Health Check:

```md
### Add Emotion

**POST** `/emotions`

Body:
```json
{
  "text": "happy"
}

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/test-keys", async (req, res) => {
  const { consumerKey, consumerSecret, tokenKey, tokenSecret } = req.body;

  const oauth = new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    },
  });

  const url = "https://api.bricklink.com/api/store/v1/orders?limit=1&direction=in";

  const headers = oauth.toHeader(
    oauth.authorize({ url, method: "GET" }, { key: tokenKey, secret: tokenSecret })
  );

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (data.meta) {
      const code = data.meta.code;

      switch (code) {
        case 200:
          return res.json({ success: true, text: "Keys are valid" });
        case 401:
          return res.status(401).json({ success: false, text: "Invalid keys (401 Unauthorized)" });
        case 403:
          return res.status(403).json({ success: false, text: "Access forbidden (403 Forbidden)" });
        case 429:
          return res.status(429).json({ success: false, text: "Too many requests (429 Rate Limit)" });
        default:
          return res.status(code).json({ success: false, text: `BrickLink error (${code}): ${data.meta.description}` });
      }
    } else {
      return res.status(500).json({ success: false, text: "Unexpected response from BrickLink" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, text: err.message });
  }
});

app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));

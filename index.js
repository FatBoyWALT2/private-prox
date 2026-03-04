import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.PROXY_KEY;

// Create an HTTPS agent that ignores SSL
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  const key = req.query.key;

  if (key !== SECRET) {
    return res.status(403).send("Forbidden");
  }

  if (!target) {
    return res.status(400).send("Missing ?url=");
  }

  try {
    const response = await fetch(target, { agent: httpsAgent });
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
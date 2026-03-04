import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.PROXY_KEY;

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
    const response = await fetch(target);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

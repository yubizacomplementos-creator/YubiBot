// v3.0 | YubiBot | Webhook WhatsApp API
// Líneas: 78

import express from "express";
import bodyParser from "body-parser";
import { manejarFlujo } from "./flujo.js";

const app = express();
app.use(bodyParser.json());

// ==========================================
// 🔹 1. VERIFICACIÓN WEBHOOK (META)
// ==========================================
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Error verificación");
    return res.sendStatus(403);
  }
});

// ==========================================
// 🔹 2. RECIBIR MENSAJES
// ==========================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    let texto = "";

    if (message.type === "text") {
      texto = message.text.body;
    } else if (message.type === "interactive") {
      texto =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "";
    } else {
      return res.sendStatus(200);
    }

    console.log("📩", from, texto);

    await manejarFlujo(from, texto);

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.sendStatus(500);
  }
});

// ==========================================
// 🔹 3. SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 YubiBot corriendo en puerto", PORT);
});

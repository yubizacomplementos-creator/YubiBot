// v2.1 | YubiCupones | Webhook WhatsApp Cloud API
// Líneas: 82

import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { manejarFlujo } from "./flujo.js";

const app = express();
app.use(bodyParser.json());

// 🔐 VARIABLES (desde Railway)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ==========================================
// 🔹 1. VERIFICACIÓN DEL WEBHOOK (META)
// ==========================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Error de verificación");
    return res.sendStatus(403);
  }
});

// ==========================================
// 🔹 2. RECEPCIÓN DE MENSAJES
// ==========================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // Si no hay mensaje, salir
    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    let texto = "";

    // 🧠 Detectar tipo de mensaje
    if (message.type === "text") {
      texto = message.text.body;
    } else if (message.type === "interactive") {
      texto =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "";
    } else {
      // Ignorar audios, imágenes, etc.
      return res.sendStatus(200);
    }

    console.log("📩 Mensaje recibido:", from, texto);

    // 🚀 Enviar al flujo (tu lógica de cupones)
    await manejarFlujo(from, texto);

    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Error webhook:", error.message);
    return res.sendStatus(500);
  }
});

// ==========================================
// 🔹 3. SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 YubiBot activo en puerto ${PORT}`);
});

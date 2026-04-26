import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { leerMensajes } from "./sheets.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("✅ YubiBot activo");
});

// 🔹 VERIFICACIÓN META
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 🔹 RECIBIR MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";

      console.log("📩 Mensaje recibido:", text);

      // 🔹 MENSAJE DESDE SHEETS
      const respuestas = await leerMensajes("bienvenida");
      const respuesta =
        respuestas[Math.floor(Math.random() * respuestas.length)] ||
        "Hola 👋";

      // 🔹 RESPUESTA
      await fetch(
        `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: respuesta }
          })
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error);
    res.sendStatus(500);
  }
});

// 🔹 ARRANQUE
app.listen(PORT, () => {
  console.log(`🚀 YubiBot corriendo en puerto ${PORT}`);
});
// 🔹 ARRANQUE (ESTO ES CLAVE)
app.listen(PORT, () => {
  console.log(`🚀 YubiBot corriendo en puerto ${PORT}`);
});

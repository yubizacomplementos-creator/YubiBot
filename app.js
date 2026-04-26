const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔐 VARIABLES DESDE RAILWAY
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 🔹 VERIFICACIÓN WEBHOOK
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado ✅");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 🔹 FUNCIÓN PARA ENVIAR MENSAJES
const enviarMensaje = async (to, mensaje) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: mensaje }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error enviando mensaje:", error.response?.data || error.message);
  }
};

// 🔹 RECIBIR MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages) {
      const message = messages[0];
      const from = message.from;
      const texto = message.text?.body?.toLowerCase() || "";

      console.log("📩 Mensaje recibido:", texto);

      // 🔥 BIENVENIDA
      if (texto.includes("hola")) {
        await enviarMensaje(
          from,
          "Hola 👋 soy YubiBot 💖\n\nEstos son nuestros productos hoy:\n\nA. Camisetas\nB. Bolsos\nC. Accesorios\n\nResponde con la letra para ver opciones 🛍️"
        );
      }

      // 👕 CAMISETAS
      else if (texto === "a") {
        await enviarMensaje(
          from,
          "👕 Camisetas disponibles:\n\n1. Blanca Festival\n2. Negra Premium\n\nResponde con el número para comprar"
        );
      }

      // 👜 BOLSOS
      else if (texto === "b") {
        await enviarMensaje(
          from,
          "👜 Bolsos disponibles:\n\n1. Bolso Vallenato\n2. Bolso Clásico\n\nResponde con el número"
        );
      }

      // 🛒 DETECTAR PEDIDO
      else if (texto === "1" || texto === "2") {
        console.log("🛒 PEDIDO DETECTADO DE:", from);

        await enviarMensaje(
          from,
          "✨ Súper elección 💖\n\nPara continuar con tu pedido envíame:\n\n- Nombre\n- Ciudad\n- Dirección\n\nY lo procesamos de inmediato 🚀"
        );
      }

      // ❓ RESPUESTA DEFAULT
      else {
        await enviarMensaje(
          from,
          "No entendí tu mensaje 😅\n\nEscribe *hola* para ver el catálogo"
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 YubiBot activo en puerto", PORT);
});

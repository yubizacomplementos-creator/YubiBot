import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔹 VARIABLES DESDE RAILWAY
const VERIFY_TOKEN = process.env.VERIFICAR_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 🔹 VERIFICACIÓN WEBHOOK (META)
app.get("/webhook", (req, res) => {
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
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";

      console.log("📩 Mensaje recibido:", text);

      // 🔥 RESPUESTA (LUEGO AQUÍ VA GEMINI)
      const respuesta = `Hola 👋 soy YubiBot 💜\n\nRecibí tu mensaje:\n"${text}"\n\nPronto te atenderé con algo más pro 😉`;

      await enviarMensaje(from, respuesta);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🔹 FUNCIÓN ENVIAR MENSAJE
async function enviarMensaje(numero, texto) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: numero,
      type: "text",
      text: { body: texto }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

// 🔹 SERVIDOR (IMPORTANTE PARA RAILWAY)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 YubiBot corriendo en puerto ${PORT}`);
});

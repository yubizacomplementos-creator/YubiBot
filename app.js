import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔹 VARIABLES
const VERIFY_TOKEN = process.env.VERIFICAR_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 🔹 VERIFICACIÓN
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
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";

      console.log("📩 Mensaje:", text);

      await enviarMensaje(
        from,
        "Hola 👋 soy YubiBot 💜\n\nEstoy activo y funcionando 🚀"
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.sendStatus(500);
  }
});

// 🔹 ENVIAR MENSAJE
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

// 🔥 PUERTO CORRECTO (SOLO UNA VEZ)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 YubiBot corriendo en puerto ${PORT}`);
});

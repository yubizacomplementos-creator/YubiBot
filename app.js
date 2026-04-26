import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

/* =========================
   CONFIGURACIÓN
========================= */
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/* =========================
   VERIFICACIÓN WEBHOOK
========================= */
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

/* =========================
   RESPUESTA DEL BOT
========================= */
function generarRespuesta(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("hola")) {
    return "Hola 👋 Bienvenida a YubiBot 💖\n\n1️⃣ Ver productos\n2️⃣ Comprar\n3️⃣ Hablar con asesor";
  }

  if (texto === "1") {
    return "🛍️ Productos disponibles:\nA. Camisetas\nB. Aretes\nC. Collares";
  }

  if (texto === "2") {
    return "Perfecto 💕 ¿Qué deseas comprar?";
  }

  if (texto === "3") {
    return "Te comunico con un asesor 👩‍💼";
  }

  return "No entendí 🤔 escribe *hola* para empezar";
}

/* =========================
   RECIBIR MENSAJES
========================= */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value || !value.messages) {
      return res.sendStatus(200);
    }

    const mensaje = value.messages[0];
    const numero = mensaje.from;
    const texto = mensaje.text?.body || "";

    console.log("📩 Mensaje recibido:", texto);

    const respuesta = generarRespuesta(texto);

    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: numero,
        text: { body: respuesta }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

/* =========================
   PUERTO PARA RAILWAY
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 YubiBot corriendo en puerto " + PORT);
});

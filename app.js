import express from "express";
import axios from "axios";
import { google } from "googleapis";

const app = express();
app.use(express.json());

// 🔹 VARIABLES
const VERIFY_TOKEN = process.env.VERIFICAR_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID;

// 🔹 GOOGLE AUTH
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

// 🔹 LEER SHEETS
async function leerHoja(nombre) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${nombre}'!A:Z`
  });

  return res.data.values || [];
}

// 🔹 WEBHOOK VERIFY
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
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

      // 🔥 PRUEBA: leer hoja "configuracion"
      const datos = await leerHoja("configuracion");

      let respuesta = "❌ No hay datos";

      if (datos.length > 0) {
        respuesta = `✅ Sheets conectado\nPrimera fila:\n${datos[0].join(" | ")}`;
      }

      await enviarMensaje(from, respuesta);
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

// 🔹 SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 YubiBot corriendo en puerto ${PORT}`);
});

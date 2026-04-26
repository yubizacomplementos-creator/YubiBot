// v1.0 - servicio sheets
// avance: 92%
// líneas: ~45

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

export async function leerHoja(nombreHoja) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `'${nombreHoja}'!A:Z`
    });

    return res.data.values || [];
  } catch (error) {
    console.error("❌ Error leyendo Sheets:", error.message);
    return [];
  }
}

// 🔹 MENSAJES dinámicos
export async function leerMensajes(tipo) {
  const filas = await leerHoja("mensajes");

  return filas
    .filter(f => f[0] === tipo)
    .map(f => f[1]);
}

import { google } from "googleapis";

// 🔹 AUTH SIN ARCHIVO
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

// 🔹 LEER HOJA
export async function leerHoja(nombreHoja, sheetId) {
  const id = sheetId || process.env.SHEET_ID;

  if (!id) throw new Error("❌ Falta SHEET_ID");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `'${nombreHoja}'!A:Z`
  });

  return res.data.values || [];
}

// 🔹 MENSAJES
export async function leerMensajes(tipo, sheetId) {
  const filas = await leerHoja("mensajes", sheetId);

  return filas
    .filter(f => f[0] === tipo)
    .map(f => f[1]);
}

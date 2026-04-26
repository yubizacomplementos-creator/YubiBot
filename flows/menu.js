// v1.0 - flujo menú
// avance: 70%
// líneas: ~40

import { enviarMensaje } from '../services/whatsapp.js';

export default async function flujoMenu(ctx, estado) {
  const texto = ctx.text?.toLowerCase().trim();

  // 🔹 opciones válidas
  const opciones = ['a', 'b', 'c'];

  // 🔹 si el usuario no ha elegido aún
  if (!opciones.includes(texto)) {
    await enviarMensaje(
      ctx.from,
      `Elige una opción para continuar 💕\n\nA. Ver productos\nB. Hablar con asesor\nC. Salir`
    );
    return;
  }

  // 🔹 manejo de opciones
  switch (texto) {
    case 'a':
      estado.paso = 'compra';
      await enviarMensaje(ctx.from, "✨ Vamos a elegir tu producto");
      break;

    case 'b':
      await enviarMensaje(
        ctx.from,
        "💬 Te conecto con una asesora en breve"
      );
      break;

    case 'c':
      await enviarMensaje(
        ctx.from,
        "💕 Gracias por escribirnos, vuelve cuando quieras"
      );
      break;
  }
}

// v1.0 - flujo bienvenida
// avance: 65%
// líneas: ~30

import { enviarMensaje } from '../services/whatsapp.js';

export default async function flujoBienvenida(ctx, estado) {
  const mensajes = [
    "¡Holaa! 💕 Bienvenida a nuestra tienda",
    "Hola hermosa 💖 gracias por escribirnos",
    "¡Hola! ✨ qué gusto tenerte aquí",
    "¡Bienvenida! 💫 tenemos cositas divinas para ti",
    "Hola linda 💕 ya te muestro lo que tenemos hoy"
  ];

  const mensaje =
    mensajes[Math.floor(Math.random() * mensajes.length)];

  await enviarMensaje(ctx.from, mensaje);

  await enviarMensaje(
    ctx.from,
    "Estos son los artículos que tenemos disponibles hoy 👇"
  );
}

// v1.0 - flujo compra
// avance: 75%
// líneas: ~40

import { enviarMensaje } from '../services/whatsapp.js';

export default async function flujoCompra(ctx, estado) {
  const texto = ctx.text?.toLowerCase().trim();

  // 🔹 ejemplo básico (luego se conecta a Shopify)
  const productos = [
    { letra: 'a', nombre: 'Camiseta blanca' },
    { letra: 'b', nombre: 'Camiseta negra' },
    { letra: 'c', nombre: 'Camiseta roja' }
  ];

  const seleccion = productos.find(p => p.letra === texto);

  // 🔹 si no elige bien
  if (!seleccion) {
    let lista = "Elige un producto 💕\n\n";

    productos.forEach(p => {
      lista += `${p.letra.toUpperCase()}. ${p.nombre}\n`;
    });

    await enviarMensaje(ctx.from, lista);
    return;
  }

  // 🔹 producto elegido
  estado.data.producto = seleccion;

  await enviarMensaje(
    ctx.from,
    `💖 Elegiste: ${seleccion.nombre}\n\nAhora vamos a elegir talla`
  );

  // 🔥 siguiente paso (después lo creamos)
  estado.paso = 'talla';
}

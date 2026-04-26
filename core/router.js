// v1.0 - router central YubiBot
// avance: 60%
// líneas: ~55

import flujoBienvenida from '../flows/bienvenida.js';
import flujoMenu from '../flows/menu.js';

// 🔹 estado en memoria (luego se puede pasar a DB)
const sesiones = {};

// 🔹 router principal
export default async function router(ctx) {
  const { from, text } = ctx;

  if (!from) return;

  // 🔹 crear sesión si no existe
  if (!sesiones[from]) {
    sesiones[from] = {
      paso: 'inicio',
      data: {}
    };
  }

  const estado = sesiones[from];

  try {
    // 🔹 flujo principal por estado
    switch (estado.paso) {

      case 'inicio':
        estado.paso = 'menu';
        await flujoBienvenida(ctx, estado);
        break;

      case 'menu':
        await flujoMenu(ctx, estado);
        break;

      default:
        // 🔹 fallback
        estado.paso = 'menu';
        await flujoMenu(ctx, estado);
        break;
    }

  } catch (error) {
    console.error('❌ Error en router:', error);
  }
}

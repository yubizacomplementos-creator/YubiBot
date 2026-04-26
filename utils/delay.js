// v1.0 - delay humano
// avance: 97%
// líneas: ~30

export function calcularDelay(texto = "") {
  const palabras = texto.split(" ").length;

  const lectura = palabras * 200; // ms por palabra
  const pensamiento = 500;
  const escritura = palabras * 100;

  return lectura + pensamiento + escritura;
}

export async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function delayMensaje(texto) {
  const tiempo = calcularDelay(texto);
  await delay(tiempo);
}

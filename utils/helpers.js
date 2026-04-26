// v1.0 - helpers generales
// avance: 96%
// líneas: ~35

export function normalizarTexto(texto = "") {
  return texto
    .toString()
    .trim()
    .toLowerCase();
}

export function esOpcionValida(texto, opciones = []) {
  return opciones.includes(normalizarTexto(texto));
}

export function obtenerRandom(array = []) {
  if (!array.length) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function formatearNumero(numero) {
  return numero.replace(/\D/g, "");
}

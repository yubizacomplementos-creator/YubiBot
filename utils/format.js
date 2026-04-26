// v1.0 - formato
// avance: 98%
// líneas: ~30

export function formatearPrecio(valor = 0) {
  return `$${valor.toLocaleString("es-CO")}`;
}

export function capitalizar(texto = "") {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function limpiarSaltos(texto = "") {
  return texto.replace(/\n{2,}/g, "\n\n");
}

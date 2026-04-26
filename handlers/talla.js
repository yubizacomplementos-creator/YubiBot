// v1.0 - handler talla
// avance: 82%
// líneas: ~30

export function obtenerTallas() {
  return ['s', 'm', 'l', 'xl'];
}

export function validarTalla(texto) {
  const tallas = obtenerTallas();
  return tallas.includes(texto.toLowerCase());
}

export function listarTallas() {
  const tallas = obtenerTallas();

  let lista = "Selecciona tu talla 👕\n\n";

  tallas.forEach(t => {
    lista += `${t.toUpperCase()}\n`;
  });

  return lista;
}

// v1.0 - handler producto
// avance: 80%
// líneas: ~35

export function obtenerProductos() {
  return [
    { letra: 'a', nombre: 'Camiseta blanca', precio: 70000 },
    { letra: 'b', nombre: 'Camiseta negra', precio: 70000 },
    { letra: 'c', nombre: 'Camiseta roja', precio: 70000 }
  ];
}

export function buscarProducto(letra) {
  const productos = obtenerProductos();
  return productos.find(p => p.letra === letra);
}

export function listarProductos() {
  const productos = obtenerProductos();

  let lista = "Elige un producto 💕\n\n";

  productos.forEach(p => {
    lista += `${p.letra.toUpperCase()}. ${p.nombre} - $${p.precio}\n`;
  });

  return lista;
}

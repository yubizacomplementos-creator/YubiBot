// v1.0 - handler carrito
// avance: 85%
// líneas: ~40

export function crearCarrito() {
  return {
    items: [],
    total: 0
  };
}

export function agregarAlCarrito(carrito, producto, talla) {
  const item = {
    producto: producto.nombre,
    talla,
    precio: producto.precio
  };

  carrito.items.push(item);
  carrito.total += producto.precio;

  return carrito;
}

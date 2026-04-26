// v1.0 - manejo de sesiones
// avance: 100%
// líneas: ~50

import { crearCarrito } from '../handlers/carrito.js';

// 🔹 memoria temporal (luego puede ser DB o Redis)
const sesiones = {};

// 🔹 obtener sesión
export function obtenerSesion(numero) {
  if (!sesiones[numero]) {
    sesiones[numero] = {
      paso: 'inicio',
      data: {},
      carrito: crearCarrito(),
      ultimaInteraccion: Date.now()
    };
  }

  return sesiones[numero];
}

// 🔹 actualizar paso
export function actualizarPaso(numero, paso) {
  const sesion = obtenerSesion(numero);
  sesion.paso = paso;
}

// 🔹 guardar dato
export function guardarDato(numero, clave, valor) {
  const sesion = obtenerSesion(numero);
  sesion.data[clave] = valor;
}

// 🔹 obtener dato
export function obtenerDato(numero, clave) {
  const sesion = obtenerSesion(numero);
  return sesion.data[clave];
}

// 🔹 obtener carrito
export function obtenerCarrito(numero) {
  const sesion = obtenerSesion(numero);
  return sesion.carrito;
}

// 🔹 resetear sesión
export function resetearSesion(numero) {
  delete sesiones[numero];
}

// 🔹 limpiar sesiones inactivas (opcional)
export function limpiarSesiones(expiracionMs = 1000 * 60 * 30) {
  const ahora = Date.now();

  for (const numero in sesiones) {
    if (ahora - sesiones[numero].ultimaInteraccion > expiracionMs) {
      delete sesiones[numero];
    }
  }
}

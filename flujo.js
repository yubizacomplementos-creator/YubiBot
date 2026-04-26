// v3.0 | Flujo Cupones

const sesiones = {};

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const CLAVE = process.env.APPROVAL_KEY;

// 🔹 Enviar mensaje
async function enviarMensaje(to, text) {
  await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    })
  });
}

// 🔹 Generar cupón simple
function crearCupon(nombre, descuento) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${nombre.substring(0,3).toUpperCase()}${descuento}${random}`;
}

// 🔹 Flujo principal
export async function manejarFlujo(from, msg) {
  const texto = msg.toLowerCase().trim();

  if (!sesiones[from]) {
    sesiones[from] = { paso: 0 };
  }

  const estado = sesiones[from];

  // Paso 0
  if (estado.paso === 0) {
    estado.paso = 1;
    return enviarMensaje(from,
      "Hola 💕 soy YubiBot\n\nDime el nombre del cliente"
    );
  }

  // Paso 1
  if (estado.paso === 1) {
    estado.nombre = msg.trim();
    estado.paso = 2;

    return enviarMensaje(from,
      "Perfecto ✨\n\n¿Qué descuento deseas?\n(Ej: 10 o 10%)"
    );
  }

  // Paso 2
  if (estado.paso === 2) {
    let limpio = msg.replace(/\s/g, "").replace("%", "");
    const descuento = Number(limpio);

    if (!descuento || descuento <= 0) {
      return enviarMensaje(from, "Ingresa un número válido 😊");
    }

    estado.descuento = descuento;
    estado.codigo = crearCupon(estado.nombre, descuento);
    estado.paso = 3;

    return enviarMensaje(from,
      "🔐 Ingresa clave de aprobación"
    );
  }

  // Paso 3
  if (estado.paso === 3) {
    if (texto !== CLAVE) {
      return enviarMensaje(from, "❌ Clave incorrecta");
    }

    const codigo = estado.codigo;
    delete sesiones[from];

    return enviarMensaje(from,
      `🎁 Cupón listo:\n\nCódigo: ${codigo}`
    );
  }
}

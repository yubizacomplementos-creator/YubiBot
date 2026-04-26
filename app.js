const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "yubibot_token";
const WHATSAPP_TOKEN = "EAANFtRzD2EABRVZC5bnYKdFAS5Wr4KD31fRgxPCyvNbi2eNAvOVtYOOEnYxiqWlyMwlm946K0mFDiRnnsK9o44PmggDWNvjqdQHnNLMKdkn1y7rySkD3jM7vBxyhCZADS8KfyOJcYsUKhLjD0TK0ZC87OlmmbncdpWSozShw7WRdxstQkNUGn9cqRw6ZAjaKFco4OuGkLbPXMZBYN98A9CSacYuWKNFlodmr9cVrHBKbLqxJ16qtufEQpvImIqwLdRLYZBExB7l7NZBi7YmZBi3ZBqPmVc5laFxgIhP98EBMZD";
const PHONE_NUMBER_ID = "1007672212440440";

// Verificación webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Recibir mensajes
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages) {
      const message = messages[0];
      const from = message.from;

      console.log("Mensaje de:", from);

      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Hola 👋 soy YubiBot, ya estoy activo 🚀" }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("YubiBot activo 🚀");
});

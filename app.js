const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Verificação da Meta
app.get("/webhook/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verificado!");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// Eventos recebidos
app.post("/webhook/whatsapp", (req, res) => {
    console.log("Webhook recebido:");
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Servidor na porta 3000");
    console.log("Token de verificação do WhatsApp:");
    console.log(process.env.WHATSAPP_VERIFY_TOKEN);
});
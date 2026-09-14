require("dotenv").config();
const express = require("express");


const app = express();

app.use(express.json());

// Verificação da Meta
app.get("/webhook/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    console.log("=== VERIFICAÇÃO DO WEBHOOK ===");
    console.log("Mode:", mode);
    console.log("Token recebido:", token);
    console.log("Token configurado:", VERIFY_TOKEN);
    console.log("Challenge:", challenge);

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verificado!");
        return res.status(200).send(challenge);
    }

    console.log("Token inválido ou parâmetros incorretos");

    return res.sendStatus(403);
});

// Eventos recebidos
app.post("/webhook/whatsapp", (req, res) => {
    console.log("Webhook recebido:");
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

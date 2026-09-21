require("dotenv").config();
const express = require("express");


const app = express();

app.use(express.json());

const clientes = ["Cliente 1", "Cliente 2", "Cliente 3", "Cliente 4", "Cliente 5"];

function listaAleatoria() {
    return [...clientes].sort(() => Math.random() - 0.5);
}

async function enviarMensagem(numero, mensagem) {
    const resposta = await fetch(
        `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: numero,
                type: "text",
                text: { body: mensagem }
            })
        }
    );

    if (!resposta.ok) {
        console.error("Erro ao enviar mensagem:", await resposta.text());
    }
}

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

    const valor = req.body.entry?.[0]?.changes?.[0]?.value;
    const mensagemRecebida = valor?.messages?.[0];
    const contacto = valor?.contacts?.[0];

    if (mensagemRecebida?.type === "text") {
        const numero = mensagemRecebida.from;
        const texto = mensagemRecebida.text.body.trim().toLowerCase();
        const nome = contacto?.profile?.name || "utilizador";
        let resposta;

        if (texto === "ola" || texto === "olá") {
            resposta = `Olá, ${nome}! Boas-vindas. O seu número é ${numero}.`;
        } else if (texto === "/cliente") {
            resposta = `Lista aleatória de clientes:\n${listaAleatoria().join("\n")}`;
        } else if (texto === "/crm") {
            resposta = "Comandos disponíveis:\n/cliente - listar clientes\n/crm - listar os comandos";
        }

        if (resposta) {
            enviarMensagem(numero, resposta).catch((erro) => {
                console.error("Erro ao enviar resposta:", erro.message);
            });
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta CARLOS ${PORT}`);
    console.log(`Webhook de verificação disponível em: http://localhost:${PORT}/webhook/whatsapp`);
    console.log(process.env.WHATSAPP_VERIFY_TOKEN);
});

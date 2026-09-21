const readline = require("readline");
require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = "1290700977460964";
const API_VERSION = "v25.0";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Número do destinatário (ex: 244956002860): ", async (numero) => {
    try {
        const resposta = await fetch(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: numero.trim(),
                    type: "text",
                    text: {
                        body: "Teste para saber se és gay. Se a sms caio bem, então és gay. Se não, então és hetero. Boa sorte!"
                    }
                })
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro ao enviar:", resultado);
        } else {
            console.log("Mensagem enviada com sucesso:", resultado);
        }
    } catch (erro) {
        console.error("Erro:", erro.message);
    } finally {
        rl.close();
    }
});
const readline = require("readline");

const ACCESS_TOKEN = "EAAWkWA0JaAABSXJz6prwdojPZCXbd3e9vVxCgNyhGNVO0yvqzP19FtUqBtjvbCvhWqJZAyJT0EVHBq3PZBI3OzLo67QBrDndLv6DX91cJBNGh5qm3YaiQw1RjvVI6ZARDCwcsd5TuMCUHSYCffp6kc0xZBS2CWBZBVNMxFU6SsYPGZCGniNwMldHtlojtLre1zjAUGasYDrW3nbhLXZAJnFDytymDVfNGTf3OdkW19fV9FWZASU7OY9HLgXfkuJfnmgIhA4REj8320ZB06zJrpPbpoaklB";
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
                    type: "template",
                    template: {
                        name: "hello_world",
                        language: {
                            code: "en_US"
                        }
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
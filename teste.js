const readline = require("readline");

const ACCESS_TOKEN="EAAWkWA0JaAABSR71eK6o3efKV64NfbV60ZC6cCUl7t7OBHuDv0mLWp7ExIhxgnZC2jiZCGdiarjcZCvNALq7buAj01tFVuIM91vHCrHZCjH0H4j1HSUAwpgYZAWTDb9GKXRJjSnKcSbinL7MnIZBHVXcgMXm5EljFjzQ2Y8ZAKgl7HrDmO3ZCfLFa7FWIJwIcrsTPWeB3IZATVRvDgDHh9xzezQGKtnYGhdOpezcaNxcyGQpixRjJZA3oMvH7066UPSxM9qBx0ZADwbEyMoIgmtZBIxNYknWJ"
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
                        body: "Teste da MarkSuite com integração do WhatsApp"
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
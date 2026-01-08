// IMPORTAÇÕES
const express = require('express'); // Framework web
const bodyParser = require('body-parser');  // Analisar corpo das requisições - pegar os arquivos JSON da requisição POST e poder manipular
const aedes = require('aedes')(); // MQTT broker
const cors = require('cors'); // liberar acesso de outros domínios

const app = express(); // Instânciando nosso aplicativo
app.use(cors()); // Permitir acesso de outras origens
app.use(bodyParser.json()); // Configurar body-parser para analisar JSON


// MQTT instance e config
const mqttServer = require('net').createServer(aedes.handle);
const MQTT_PORT = 1883; 

// ABRIR SERVIDOR MQTT
mqttServer.listen(MQTT_PORT, () => {
    console.log(`MQTT server rodando na porta ${MQTT_PORT}`);
});

////////////////////////////////////////////////////////////////
aedes.on('client', (client) => {
    console.log("Cliente conectado:", client);  
});

aedes.on('clientDisconnect', (client) => {
    console.log("Cliente desconectado:", client);
});

// aedes.on('publish', (packet, client) => {
//     console.log(`Mensagem recebida do cliente ${client} -  tópico: ${packet.topic}: ${packet.payload.toString()}`);
// }); -- ANITIGA VERSÃO

// método ativado quando uma mensagem é publicada
aedes.on('publish', async function (packet, client) {
    console.log(`Mensagem recebida do cliente ${client ? client.id : 'BROKER' + aedes.id} - tópico: ${packet.topic}: ${packet.payload.toString()}`);
});
////////////////////////////////////////////////////////////////


app.get('/', (req, res) => {
    res.send({ message: 'API MQTT rodando' });
});

app.post('/send', (req, res) => {
    try {
        const mensagem = req.body.mensagem;
        aedes.publish({ topic: 'esp32/data', payload: mensagem });
        res.status(200).send({ message: 'Mensagem publicada no tópico esp32/data' });
    } catch (error) {
        throw new Error('Erro ao publicar mensagem: ');
    }
});

const HTTP_PORT = 3000;
app.listen(HTTP_PORT, () => {
    console.log(`HTTP server rodando na porta ${HTTP_PORT}`);
});
// websocketServer.js
const WebSocket = require('ws');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server: server });
    let numClients = 0;

    wss.on('connection', function connection(ws) {
        numClients++;
        console.log('A new client connected');

        // Send a message to the newly connected client
        ws.send('Welcome to the WebSocket server!');

        ws.on('message', function incoming(message) {
            console.log('Received message:', message);
            ws.send(`Server received message: ${message}.`);
        });

        // ws.send('Connected to WebSocket server');

        // ws.on('error', function error(err) {
        //     console.error('WebSocket error:', err);
        // });

        // ws.on('close', function close() {
        //     numClients--;
        //     console.log(`A client disconnected. Total clients: ${numClients}`);
        // });
    });

    console.log(numClients)
}

module.exports = setupWebSocketServer;

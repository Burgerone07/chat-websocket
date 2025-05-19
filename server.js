const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Nuovo client connesso');

  ws.on('message', function incoming(message) {
    const text = message.toString();
    console.log('Messaggio ricevuto:', text);

    fs.appendFile('chat.log', text + '\n', (err) => {
      if (err) console.error('Errore scrittura su file:', err);
    });

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnesso');
  });
});

server.listen(8080, () => {
  console.log('Server WebSocket in ascolto su ws://localhost:8080');
});

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

// Crea un server HTTP che risponde per evitare timeout di Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server attivo su Render');
});

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

// Porta richiesta da Render
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server WebSocket in ascolto su port ${PORT}`);
});

// socket-server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3001 }); // Use a different port (e.g., 3001)

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    // Broadcast the updated text to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text: data.text }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3001');

//node socket-server.js
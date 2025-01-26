// socket-server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3001 }); 

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Broadcast the updated online users count to all clients
  const broadcastUserCount = () => {
    const onlineUsers = wss.clients.size;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'userCount', count: onlineUsers }));
      }
    });
  };

  // Send initial user count
  broadcastUserCount();

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', JSON.stringify(data, null, 2));

    // Broadcast the updated text to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ contents: data.contents }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3001');

//node socket-server.js
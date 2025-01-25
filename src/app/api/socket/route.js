// app/api/socket/route.js
import { Server } from 'socket.io';

export const dynamic = 'force-dynamic';

const documentStates = {};

export async function GET(request) {
  if (!global.io) {
    const io = new Server({
      path: '/api/socket',
      addTrailingSlash: false
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('join-document', (documentId) => {
        socket.join(documentId);
        const documentContent = documentStates[documentId] || '';
        socket.emit('document-state', documentContent);
      });

      socket.on('text-change', (data) => {
        const { documentId, text } = data;
        documentStates[documentId] = text;
        socket.to(documentId).emit('text-update', text);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    global.io = io;
  }

  return new Response(null, { status: 200 });
}
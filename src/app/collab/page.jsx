// path: src/app/collab/page.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Users } from 'lucide-react';

const CollabEditor = () => {
  const [quill, setQuill] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0); // Dynamic online users count
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Quill editor
    const quillInstance = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ color: [] }, { background: [] }],
          ['link', 'image', 'code-block'],
          ['clean'],
        ],
      },
      placeholder: 'Start writing something amazing...',
    });

    setQuill(quillInstance);

    // Connect to WebSocket server
    socketRef.current = new WebSocket('ws://localhost:3001');

    // Handle incoming messages from the server
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'userCount') {
        setOnlineUsers(data.count); // Update online users count
      } else if (data.contents) {
        quillInstance.setContents(data.contents); // Update editor content
      }
    };

    // Handle WebSocket errors
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle WebSocket connection close
    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (!quill || !socketRef.current) return;

    // Handle text changes in Quill
    const handler = (delta, oldDelta, source) => {
      if (source === 'user') {
        const contents = quill.getContents();
        socketRef.current.send(JSON.stringify({ contents }));
      }
    };

    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [quill]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>আলাপন</h1>
        <div className={styles.userInfo}>
          <Users size={20} />
          <span>{onlineUsers} online</span>
        </div>
      </div>
      <div className={styles.editorWrapper}>
        <div ref={editorRef} className={styles.editor} />
      </div>
    </div>
  );
};

export default CollabEditor;
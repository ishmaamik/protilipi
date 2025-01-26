// src/app/collab/page.jsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';

const CollabEditor = () => {
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket('ws://localhost:3001');

    // Handle incoming messages from the server
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setText(data.text);
    };

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Send the updated text to the server
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text: newText }));
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.editor}
        value={text}
        onChange={handleTextChange}
        placeholder="Start collaborating..."
      />
    </div>
  );
};

export default CollabEditor;
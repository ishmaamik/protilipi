// path: src/app/collab/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import components to prevent SSR issues
const RoomForm = dynamic(() => import('./components/RoomForm'), { ssr: false });
const CollabEditor = dynamic(() => import('./components/CollabEditor'), { ssr: false });

const CollabPage = () => {
  const [roomData, setRoomData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleJoinRoom = (data) => {
    setRoomData(data);
  };

  if (!isClient) {
    return null; // Prevent rendering on server
  }

  return (
    <div className={styles.container}>
      {!roomData ? (
        <RoomForm onJoinRoom={handleJoinRoom} />
      ) : (
        <CollabEditor roomId={roomData.roomId} username={roomData.username} />
      )}
    </div>
  );
};

export default CollabPage;
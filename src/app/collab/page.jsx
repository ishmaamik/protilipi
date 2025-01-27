// path: src/app/collab/page.jsx
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import CollabEditor from './components/CollabEditor';
import RoomForm from './components/RoomForm';

const CollabPage = () => {
  const [roomData, setRoomData] = useState(null);

  const handleJoinRoom = (data) => {
    setRoomData(data);
  };

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
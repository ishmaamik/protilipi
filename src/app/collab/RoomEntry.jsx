// path: src/app/collab/RoomEntry.jsx
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const RoomEntry = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinRoom = () => {
    if (roomId && username) {
      onJoinRoom(roomId, username);
    }
  };

  return (
    <div className={styles.roomEntryContainer}>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      <p>Don't have a room ID? <button onClick={() => onJoinRoom('', username)}>Create a new room</button></p>
    </div>
  );
};

export default RoomEntry;
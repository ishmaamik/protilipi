// path: src/app/collab/components/RoomForm.jsx
'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';

const RoomForm = ({ onJoinRoom }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    username: '',
    isNewRoom: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.isNewRoom && !formData.roomId.trim()) {
      setError('Room ID is required to join an existing room');
      return;
    }

    const roomId = formData.isNewRoom 
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : formData.roomId;

    onJoinRoom({
      roomId,
      username: formData.username
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>আলাপন</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.isNewRoom}
                onChange={(e) => setFormData({ ...formData, isNewRoom: e.target.checked })}
                className={styles.checkbox}
              />
              Create a new room
            </label>
          </div>

          {!formData.isNewRoom && (
            <div className={styles.formGroup}>
              <label htmlFor="roomId">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value.toUpperCase() })}
                placeholder="Enter room ID"
                className={styles.input}
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.button}>
            {formData.isNewRoom ? 'Create Room' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;

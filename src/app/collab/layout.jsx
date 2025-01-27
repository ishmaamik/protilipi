import React from 'react';
import styles from './page.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      {children}
    </div>
  );
};

export default Layout;
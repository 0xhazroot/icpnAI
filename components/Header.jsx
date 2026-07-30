'use client';

import React from 'react';
import { Search, Bell, Chrome } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ title = 'Dashboard' }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar unidades, PDFs, tareas del ICPNA..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.syncBadge}>
          <span className={styles.pulseDot}></span>
          <Chrome size={14} />
          <span>Google Classroom Sincronizado</span>
        </div>

        <button className={styles.iconBtn} title="Notificaciones">
          <Bell size={18} />
          <span className={styles.notifBadge}></span>
        </button>
      </div>
    </header>
  );
}

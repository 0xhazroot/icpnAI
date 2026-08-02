'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Chrome, X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Bienvenido a icpnAI Studio',
      message: 'Conecta tu cuenta de Google Classroom en la pestaña Conexiones para sincronizar tus rúbricas.',
      time: 'Hace 5 min',
      type: 'info'
    },
    {
      id: 2,
      title: 'Sistema de Notas ICPNA Actualizado',
      message: 'Tus evaluativos se ponderan exactamente sobre 20 Pts (7 ítems de 2pts + ALP 4pts + Final Exam 4pts).',
      time: 'Hoy',
      type: 'success'
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      // If redirected back from OAuth with success status, persist it
      if (urlParams.get('status') === 'google_connected') {
        localStorage.setItem('google_classroom_connected', 'true');
        setIsConnected(true);
        // Clean URL params without reload
        window.history.replaceState({}, '', window.location.pathname);
      } else if (localStorage.getItem('google_classroom_connected') === 'true') {
        setIsConnected(true);
      }
    }
  }, []);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
        {/* Dynamic Google Classroom Status Badge */}
        <div className={isConnected ? styles.syncBadgeConnected : styles.syncBadgeDisconnected}>
          <span className={isConnected ? styles.pulseDotGreen : styles.pulseDotGray}></span>
          <Chrome size={14} />
          <span>{isConnected ? 'Classroom Sincronizado' : 'Classroom Sin Conectar'}</span>
        </div>

        {/* Notifications Dropdown Container */}
        <div className={styles.notifContainer}>
          <button 
            className={styles.iconBtn} 
            title="Notificaciones"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {notifications.length > 0 && <span className={styles.notifBadge}>{notifications.length}</span>}
          </button>

          {showNotifications && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h3>Notificaciones del Sistema</h3>
                <button className={styles.closeBtn} onClick={() => setShowNotifications(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNotif}>No tienes notificaciones pendientes</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={styles.notifItem}>
                      <div className={styles.notifIcon}>
                        {n.type === 'success' ? <CheckCircle2 size={16} className={styles.textSuccess} /> : <AlertCircle size={16} className={styles.textInfo} />}
                      </div>
                      <div className={styles.notifContent}>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                      <button className={styles.deleteNotifBtn} onClick={() => clearNotification(n.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

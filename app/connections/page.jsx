'use client';

import React, { useState, useEffect } from 'react';
import { Chrome, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ConnectionsPage() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('status') === 'google_connected' || localStorage.getItem('google_classroom_token')) {
        setIsConnected(true);
      }
    }
  }, []);

  const handleGoogleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '751539910196-rb7cen7rinfmo7ihcn34k41hg7a2v62r.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/userinfo.email');
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conexiones & OAuth</h1>
        <p className={styles.subtitle}>Vincula tu cuenta institucional de Google Classroom de forma segura mediante OAuth 2.0</p>
      </div>

      <div className={styles.singleCardWrapper}>
        {/* Google & Google Classroom Card strictly */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.iconBox}>
              <Chrome size={28} />
            </div>
            <div className={isConnected ? styles.statusConnected : styles.statusDisconnected}>
              {isConnected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{isConnected ? 'Cuenta Vinculada & Sincronizada' : 'Sin Conectar'}</span>
            </div>
          </div>

          <h3 className={styles.cardTitle}>Google Classroom API</h3>
          <p className={styles.cardDesc}>
            Permite a icpnAI Studio conectarse con tu cuenta oficial para leer tus cursos activos del ICPNA, 
            descargar los PDFs asignados por tus profesores y auto-calcular tus calificaciones en tiempo real.
          </p>

          <div className={styles.scopesList}>
            <div className={styles.scopeItem}>
              <ShieldCheck size={16} />
              <span>Acceso de solo lectura a tareas, rúbricas y entregables (<code>courseworkmaterials.readonly</code>)</span>
            </div>
            <div className={styles.scopeItem}>
              <ShieldCheck size={16} />
              <span>Autenticación OAuth 2.0 cifrada directamente en servidores de Google Cloud</span>
            </div>
          </div>

          <button onClick={handleGoogleAuth} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            <span>{isConnected ? 'Re-autenticar Google Classroom' : 'Conectar Cuenta de Google Classroom'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

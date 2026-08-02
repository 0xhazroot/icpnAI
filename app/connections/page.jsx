'use client';

import React, { useState, useEffect } from 'react';
import { Chrome, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function ConnectionsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for OAuth error from redirect
      const error = searchParams.get('error');
      if (error) {
        const errorMessages = {
          'admin_policy_enforced': 'Tu cuenta institucional (@icpna.edu.pe) tiene una política de seguridad que bloquea apps no verificadas. Usa tu cuenta personal @gmail.com.',
          'access_denied': 'Denegaste el acceso a Google Classroom. Intenta nuevamente.',
          'no_code': 'No se recibió código de autorización de Google.',
          'missing_credentials': 'Faltan credenciales de Google Cloud en el servidor (.env.local).',
          'server_error': 'Error interno del servidor al procesar la autenticación.',
        };
        setErrorMsg(errorMessages[error] || `Error de autenticación: ${error}`);
      }

      // Check persistent connection state
      if (localStorage.getItem('google_classroom_connected') === 'true') {
        setIsConnected(true);
      }
    }
  }, [searchParams]);

  const handleGoogleAuth = () => {
    setErrorMsg('');
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

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={18} />
          <div>
            <strong>Error de Autenticación</strong>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      <div className={styles.singleCardWrapper}>
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

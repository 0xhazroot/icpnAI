'use client';

import React from 'react';
import { Chrome, Github, CheckCircle2, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import styles from './page.module.css';

export default function ConnectionsPage() {

  const handleGoogleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '751539910196-rb7cen7rinfmo7ihcn34k41hg7a2v62r.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/userinfo.email');
    
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
    
    window.location.href = googleOAuthUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conexiones & OAuth</h1>
        <p className={styles.subtitle}>Gestiona el acceso a tus servicios externos de forma independiente y segura</p>
      </div>

      <div className={styles.grid}>
        {/* Google & Google Classroom Card */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.iconBox}>
              <Chrome size={24} />
            </div>
            <div className={styles.statusConnected}>
              <CheckCircle2 size={14} />
              <span>Conectado</span>
            </div>
          </div>

          <h3 className={styles.cardTitle}>Google & Google Classroom</h3>
          <p className={styles.cardDesc}>
            Permite a la Web App sincronizar automáticamente tus cursos del ICPNA, descargar los PDFs de las unidades y detectar nuevas tareas asignadas por tu profesor.
          </p>

          <div className={styles.scopesList}>
            <div className={styles.scopeItem}>
              <ShieldCheck size={14} />
              <span>Lectura de Materiales e Historial de Classroom</span>
            </div>
            <div className={styles.scopeItem}>
              <ShieldCheck size={14} />
              <span>Autenticación segura con Google OAuth 2.0</span>
            </div>
          </div>

          <button onClick={handleGoogleAuth} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            <span>Sincronizar / Re-autenticar Google</span>
          </button>
        </div>

        {/* GitHub Card */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.iconBoxSec}>
              <Github size={24} />
            </div>
            <div className={styles.statusConnected}>
              <CheckCircle2 size={14} />
              <span>Conectado</span>
            </div>
          </div>

          <h3 className={styles.cardTitle}>GitHub Integration</h3>
          <p className={styles.cardDesc}>
            Conecta tu cuenta de GitHub para sincronizar tus repositorios de código, guías de estudio en markdown y mantener actualizado tu portafolio.
          </p>

          <div className={styles.scopesList}>
            <div className={styles.scopeItem}>
              <ShieldCheck size={14} />
              <span>Acceso al repositorio <strong>0xhazroot/icpnAI</strong></span>
            </div>
            <div className={styles.scopeItem}>
              <ShieldCheck size={14} />
              <span>Push automático de cambios y commits estructurados</span>
            </div>
          </div>

          <button className={styles.btnSecondary}>
            <KeyRound size={16} />
            <span>Conectar GitHub OAuth</span>
          </button>
        </div>
      </div>
    </div>
  );
}

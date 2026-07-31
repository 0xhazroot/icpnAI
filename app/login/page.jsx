'use client';

import React from 'react';
import { Chrome, Sparkles, ShieldCheck, ArrowRight, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '751539910196-rb7cen7rinfmo7ihcn34k41hg7a2v62r.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/userinfo.email');
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* Left Panel: Hero Presentation (Cisco NetAcad Inspired Style) */}
        <div className={styles.leftPanel}>
          <div className={styles.brandHeader}>
            <div className={styles.logoBadge}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <span className={styles.brandTitle}>icpnAI Studio</span>
          </div>

          <div className={styles.heroContent}>
            <span className={styles.kicker}>Plataforma Educativa Personal</span>
            <h1 className={styles.heroTitle}>
              Tu espacio inteligente para dominar cada ciclo en el <strong>ICPNA</strong>
            </h1>
            <p className={styles.heroSub}>
              Sincroniza tus cursos de Google Classroom, auto-calcula tus notas ponderadas sobre 20 Pts 
              y estudia con la potencia multimodal de Google Gemini 2.0.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <CheckCircle2 size={18} className={styles.featureIcon} />
                <span>Extracción automática de tareas, rúbricas y PDFs de Classroom</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={18} className={styles.featureIcon} />
                <span>Calculadora oficial sobre 20 Pts (Writing, Speaking, ALP y Exam)</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={18} className={styles.featureIcon} />
                <span>Baúl Académico para organizar PDFs de tus ciclos pasados</span>
              </div>
            </div>
          </div>

          <div className={styles.footerNotice}>
            <GraduationCap size={16} />
            <span>Diseñado para estudiantes del ICPNA con estándares de alta fidelidad.</span>
          </div>
        </div>

        {/* Right Panel: Google Login Action Card */}
        <div className={styles.rightPanel}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h2>Iniciar Sesión</h2>
              <p>Accede con tu cuenta institucional o personal vinculada a Google Classroom</p>
            </div>

            <div className={styles.oauthSection}>
              <button onClick={handleGoogleLogin} className={styles.googleBtn}>
                <Chrome size={22} className={styles.googleIcon} />
                <span>Ingresar con Google Classroom</span>
                <ArrowRight size={18} className={styles.arrowIcon} />
              </button>
            </div>

            <div className={styles.securityBadge}>
              <ShieldCheck size={16} className={styles.shieldIcon} />
              <span>Autenticación oficial OAuth 2.0 de Google Cloud sin contraseñas guardadas.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

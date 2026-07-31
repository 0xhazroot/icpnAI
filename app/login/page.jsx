'use client';

import React, { useState } from 'react';
import { 
  Chrome, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '751539910196-rb7cen7rinfmo7ihcn34k41hg7a2v62r.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/userinfo.email');
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  };

  return (
    <div className={styles.fullscreenContainer}>
      
      {/* LEFT FULLSCREEN HERO PANEL (Pitch Black #000000 - 60% Width, 100vh Height) */}
      <div className={styles.leftPanel}>
        
        {/* Top Brand Navbar Header */}
        <div className={styles.brandNavbar}>
          <div className={styles.brandLogoBox}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>icpnAI Studio</span>
            <span className={styles.brandTag}>Academia Personal IA</span>
          </div>
        </div>

        {/* Center Hero Title & Description */}
        <div className={styles.heroBody}>
          <div className={styles.badgeCapsule}>
            <Zap size={14} className={styles.zapIcon} />
            <span>Sistema Oficial ICPNA 20.0 Pts • Google Cloud & Gemini 2.0</span>
          </div>

          <h1 className={styles.mainHeading}>
            La plataforma inteligente de alto rendimiento para alumnos del <strong>ICPNA</strong>
          </h1>

          <p className={styles.leadParagraph}>
            Sincronización automatizada con Google Classroom, análisis multimodal de PDFs de unidades 
            con Gemini 2.0 y cálculo en tiempo real de tus rúbricas escritas y orales.
          </p>

          {/* Interactive Feature Highlights Grid (Cisco NetAcad Inspired) */}
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureCardHeader}>
                <div className={styles.iconCircle}><BookOpen size={18} /></div>
                <span>Classroom Sync</span>
              </div>
              <p>Extracción de tareas, avisos y PDFs de unidades sin esfuerzo manual.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardHeader}>
                <div className={styles.iconCircle}><Award size={18} /></div>
                <span>20 Pts Ponderado</span>
              </div>
              <p>Writing, Speaking, Reading Quiz, ALP (4pts) y Examen Final (4pts).</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardHeader}>
                <div className={styles.iconCircle}><Layers size={18} /></div>
                <span>Baúl Académico</span>
              </div>
              <p>Guarda y consulta PDFs de tus ciclos pasados (Basic, Intermediate, Advanced).</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className={styles.leftFooter}>
          <div className={styles.liveMetric}>
            <span className={styles.greenPulse}></span>
            <span>API Google Cloud Ready</span>
          </div>
          <span className={styles.footerText}>
            <GraduationCap size={15} />
            Diseñado para excelencia académica ICPNA.
          </span>
        </div>

      </div>

      {/* RIGHT FULLSCREEN LOGIN FORM PANEL (Off-White #F5F5F7 - 40% Width, 100vh Height) */}
      <div className={styles.rightPanel}>
        <div className={styles.loginFormBox}>
          
          <div className={styles.formHeader}>
            <span className={styles.portalLabel}>PORTAL DE ACCESO ALUMNO</span>
            <h2>Bienvenido a tu Studio</h2>
            <p>Inicia sesión con tu cuenta institucional o personal vinculada a Google Classroom</p>
          </div>

          {/* Main Action Google Classroom OAuth Button */}
          <div className={styles.actionContainer}>
            <button 
              onClick={handleGoogleLogin} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={styles.primaryGoogleBtn}
            >
              <div className={styles.googleBtnLeft}>
                <div className={styles.chromeIconWrapper}>
                  <Chrome size={22} />
                </div>
                <div className={styles.btnTextGroup}>
                  <span className={styles.btnMainText}>Ingresar con Google Classroom</span>
                  <span className={styles.btnSubText}>Acceso mediante OAuth 2.0 seguro</span>
                </div>
              </div>
              <ArrowRight size={20} className={`${styles.arrowIcon} ${isHovered ? styles.arrowAnimated : ''}`} />
            </button>
          </div>

          {/* Security & System Info Badges */}
          <div className={styles.securityBox}>
            <div className={styles.securityItem}>
              <ShieldCheck size={18} className={styles.shieldIcon} />
              <div>
                <strong>Cifrado OAuth 2.0 Directo</strong>
                <p>Sin contraseñas almacenadas localmente. Conexión segura validada con Google Cloud.</p>
              </div>
            </div>
            <div className={styles.securityItem}>
              <Globe size={18} className={styles.globeIcon} />
              <div>
                <strong>Google Classroom API Enabled</strong>
                <p>Lectura automática de <code>courseworkmaterials.readonly</code> para tus asignaciones.</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className={styles.copyrightText}>
            © 2026 icpnAI Studio • Powered by Google Gemini 2.0 & Next.js 15
          </div>

        </div>
      </div>

    </div>
  );
}

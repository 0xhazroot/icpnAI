'use client';

import React, { useState } from 'react';
import { 
  Database, 
  RotateCw, 
  CheckCircle2, 
  FileText, 
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './page.module.css';

// Chart Data matching Monochromatic style
const gradeTrendData = [
  { name: 'W1', score: 2.0, max: 2 },
  { name: 'S1', score: 1.8, max: 2 },
  { name: 'W2', score: 1.9, max: 2 },
  { name: 'S2', score: 2.0, max: 2 },
  { name: 'W3', score: 1.7, max: 2 },
  { name: 'S3', score: 1.9, max: 2 },
  { name: 'Quiz', score: 1.8, max: 2 },
  { name: 'ALP', score: 3.8, max: 4 },
  { name: 'Final', score: 3.6, max: 4 },
];

export default function DashboardPage() {
  // ICPNA Official Grading System (Total 20 Pts)
  // W1, W2, W3: 2 pts max each
  // S1, S2, S3: 2 pts max each
  // Reading Quiz: 2 pts max
  // ALP (Project): 4 pts max
  // Final Exam: 4 pts max
  const [grades, setGrades] = useState({
    w1: 2.0, w2: 1.9, w3: 1.7,
    s1: 1.8, s2: 2.0, s3: 1.9,
    quiz: 1.8,
    alp: 3.8,
    final: 3.6
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleGradeChange = (key, val, maxVal) => {
    const num = Math.min(maxVal, Math.max(0, parseFloat(val) || 0));
    setGrades(prev => ({ ...prev, [key]: num }));
  };

  // Sum exact ICPNA total score out of 20 points
  const calculateTotalScore = () => {
    const total = Object.values(grades).reduce((acc, curr) => acc + curr, 0);
    return total.toFixed(1);
  };

  const totalScore = calculateTotalScore();
  const isPassing = parseFloat(totalScore) >= 14.0;

  const triggerClassroomSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/classroom/sync', { method: 'POST' });
      const data = await res.json();
      console.log('Classroom Sync Result:', data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSyncing(false), 1200);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Top Banner explaining Classroom + Gemini AI classification */}
      <div className={styles.aiBanner}>
        <div className={styles.aiBannerText}>
          <div className={styles.aiBadge}>
            <Sparkles size={14} />
            <span>Google Classroom + Gemini 2.0 Auto-Clasificador</span>
          </div>
          <h2>Sincronización Inteligente de Rúbricas ICPNA</h2>
          <p>
            Gemini analiza los títulos y archivos subidos a tu Google Classroom, los clasifica en 
            <strong> Writing (2pts)</strong>, <strong>Speaking (2pts)</strong>, <strong>Quiz (2pts)</strong>, 
            <strong> ALP (4pts)</strong> y <strong>Examen Final (4pts)</strong>, calculando tu avance acumulado sobre 20.
          </p>
        </div>
        <button onClick={triggerClassroomSync} disabled={isSyncing} className={styles.syncBtn}>
          <RotateCw size={16} className={isSyncing ? styles.spinIcon : ''} />
          <span>{isSyncing ? 'Escaneando Classroom...' : 'Escanear Classroom'}</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Nivel Clasificado</span>
            <Database size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>ICPNA Intermediate 06</span>
          <span className={styles.metricSub}>Sincronizado vía Classroom API</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Unidades Clasificadas</span>
            <Layers size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>2 Unidades Activas</span>
          <span className={styles.metricSub}>Unit 1: Culture • Unit 2: Tech</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Puntaje Acumulado</span>
            <TrendingUp size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>{totalScore} / 20.0 pts</span>
          <span className={styles.metricSub}>Sistema Oficial ICPNA</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Estado Académico</span>
            <Award size={16} className={styles.metricIcon} />
          </div>
          <span className={`${styles.metricValue} ${isPassing ? styles.textSuccess : styles.textDanger}`}>
            {isPassing ? 'APROBADO' : 'EN RIESGO'}
          </span>
          <span className={styles.metricSub}>Nota Mínima de Aprobación: 14.0 pts</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        
        {/* Left Column: Grade Calculator & Trend Chart */}
        <div className={styles.leftCol}>
          
          {/* Trend Chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Desglose de Rendimiento por Rúbrica</h3>
                <p className={styles.cardSub}>Evaluación continua sobre la ponderación oficial del ICPNA</p>
              </div>
              <span className={styles.badgePill}>Ciclo Actual</span>
            </div>

            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={gradeTrendData}>
                  <XAxis dataKey="name" stroke="#8e8e93" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 4]} stroke="#8e8e93" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#000000', borderRadius: '8px', border: 'none', color: '#ffffff' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#000000" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#000000', r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Official ICPNA Grade Calculator */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Calculadora Oficial ICPNA (Puntos Exactos)</h3>
                <p className={styles.cardSub}>7 evaluaciones de 2 pts + ALP (4 pts) + Examen Final (4 pts)</p>
              </div>
              <div className={styles.scorePill}>
                <span>Total:</span>
                <strong>{totalScore} / 20 Pts</strong>
              </div>
            </div>

            <div className={styles.gradesSectionTitle}>Rúbricas Estándar (Vale 2 Puntos c/u)</div>
            <div className={styles.gradesGrid}>
              <div className={styles.gradeBox}>
                <label>Writing 1 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.w1} onChange={(e) => handleGradeChange('w1', e.target.value, 2.0)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Writing 2 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.w2} onChange={(e) => handleGradeChange('w2', e.target.value, 2.0)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Writing 3 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.w3} onChange={(e) => handleGradeChange('w3', e.target.value, 2.0)} />
              </div>

              <div className={styles.gradeBox}>
                <label>Speaking 1 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.s1} onChange={(e) => handleGradeChange('s1', e.target.value, 2.0)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Speaking 2 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.s2} onChange={(e) => handleGradeChange('s2', e.target.value, 2.0)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Speaking 3 (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.s3} onChange={(e) => handleGradeChange('s3', e.target.value, 2.0)} />
              </div>

              <div className={styles.gradeBox}>
                <label>Reading Quiz (Max 2.0)</label>
                <input type="number" step="0.1" value={grades.quiz} onChange={(e) => handleGradeChange('quiz', e.target.value, 2.0)} />
              </div>
            </div>

            <div className={styles.gradesSectionTitle} style={{ marginTop: '16px' }}>Evaluaciones Mayores (Vale 4 Puntos c/u)</div>
            <div className={styles.gradesGridMajor}>
              <div className={`${styles.gradeBox} ${styles.majorBox}`}>
                <label>ALP - Advanced Learning Project (Max 4.0 Pts)</label>
                <input type="number" step="0.1" value={grades.alp} onChange={(e) => handleGradeChange('alp', e.target.value, 4.0)} />
              </div>
              <div className={`${styles.gradeBox} ${styles.majorBox}`}>
                <label>Examen Final Escrito (Max 4.0 Pts)</label>
                <input type="number" step="0.1" value={grades.final} onChange={(e) => handleGradeChange('final', e.target.value, 4.0)} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Tareas Extraídas de Classroom</h3>
              <span className={styles.taskCount}>3 Pendientes</span>
            </div>

            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>Writing #2: Opinion Essay</span>
                  <span className={styles.taskMeta}>Vale 2 Pts • Tarea de Classroom</span>
                </div>
              </div>

              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>ALP Draft Video Submission</span>
                  <span className={styles.taskMeta}>Vale 4 Pts • Proyecto Final</span>
                </div>
              </div>

              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>Reading Quiz - Unit 2</span>
                  <span className={styles.taskMeta}>Vale 2 Pts • Próximo Viernes</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Clasificación por Tema (Gemini)</h3>
            </div>

            <div className={styles.fileList}>
              <div className={styles.fileItem}>
                <BookOpen size={18} className={styles.fileIcon} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>Unit 01: Global Culture</span>
                  <span className={styles.fileMeta}>3 Tareas • W1, S1, Vocabulary</span>
                </div>
              </div>

              <div className={styles.fileItem}>
                <BookOpen size={18} className={styles.fileIcon} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>Unit 02: Technology & Future</span>
                  <span className={styles.fileMeta}>4 Tareas • W2, S2, ALP, Quiz</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

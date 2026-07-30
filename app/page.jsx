'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './page.module.css';

// Chart Data matching Monochromatic style of Image 2
const gradeTrendData = [
  { name: 'Unit 1', score: 17.0 },
  { name: 'W1', score: 18.0 },
  { name: 'S1', score: 19.0 },
  { name: 'W2', score: 17.0 },
  { name: 'S2', score: 18.0 },
  { name: 'Unit 2', score: 17.6 },
];

export default function DashboardPage() {
  // ICPNA Grade State (3 Writings, 3 Speakings, 1 Quiz, 1 ALP, 1 Final Exam)
  const [grades, setGrades] = useState({
    w1: 18, w2: 17, w3: 16,
    s1: 19, s2: 18, s3: 17,
    quiz: 18,
    alp: 19,
    final: 17
  });

  const handleGradeChange = (key, val) => {
    const num = Math.min(20, Math.max(0, parseFloat(val) || 0));
    setGrades(prev => ({ ...prev, [key]: num }));
  };

  // Calculate Weighted Grade Average (Out of 20)
  const calculateAverage = () => {
    const values = Object.values(grades);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(1);
  };

  const average = calculateAverage();
  const isPassing = parseFloat(average) >= 14;

  return (
    <div className={styles.container}>
      
      {/* Metric Cards Row (Inspired by Image 2 Top Cards) */}
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Nivel Clasificado</span>
            <Database size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>ICPNA Intermediate 06</span>
          <span className={styles.metricSub}>Sincronizado de Classroom</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Unidades Activas</span>
            <RotateCw size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>Unit 1 & Unit 2</span>
          <span className={styles.metricSub}>4 Materiales de Estudio</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Promedio Ponderado</span>
            <TrendingUp size={16} className={styles.metricIcon} />
          </div>
          <span className={styles.metricValue}>{average} / 20</span>
          <span className={styles.metricSub}>Calculado en tiempo real</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Estado Académico</span>
            <Award size={16} className={styles.metricIcon} />
          </div>
          <span className={`${styles.metricValue} ${isPassing ? styles.textSuccess : styles.textDanger}`}>
            {isPassing ? 'APROBADO' : 'EN RIESGO'}
          </span>
          <span className={styles.metricSub}>Mínimo para aprobar: 14.0</span>
        </div>
      </div>

      {/* Main Grid: Left Workspace & Right Sidebar Widgets */}
      <div className={styles.mainGrid}>
        
        {/* Left Column: Grade Calculator & Trend Chart */}
        <div className={styles.leftCol}>
          
          {/* Trend Chart (Matching Image 2 Line Chart) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Rendimiento del Ciclo</h3>
                <p className={styles.cardSub}>Evolución de notas por evaluación</p>
              </div>
              <span className={styles.badgePill}>Oct 7 - Oct 30</span>
            </div>

            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={gradeTrendData}>
                  <XAxis dataKey="name" stroke="#8e8e93" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[10, 20]} stroke="#8e8e93" fontSize={12} tickLine={false} axisLine={false} />
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

          {/* ICPNA Grade Calculator (20 Points) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Calculadora ICPNA (20 Puntos)</h3>
                <p className={styles.cardSub}>Actualiza tus notas de cada rúbrica</p>
              </div>
              <div className={styles.scorePill}>
                <span>Nota Final:</span>
                <strong>{average} / 20</strong>
              </div>
            </div>

            <div className={styles.gradesGrid}>
              <div className={styles.gradeBox}>
                <label>Writing 1</label>
                <input type="number" value={grades.w1} onChange={(e) => handleGradeChange('w1', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Writing 2</label>
                <input type="number" value={grades.w2} onChange={(e) => handleGradeChange('w2', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Writing 3</label>
                <input type="number" value={grades.w3} onChange={(e) => handleGradeChange('w3', e.target.value)} />
              </div>

              <div className={styles.gradeBox}>
                <label>Speaking 1</label>
                <input type="number" value={grades.s1} onChange={(e) => handleGradeChange('s1', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Speaking 2</label>
                <input type="number" value={grades.s2} onChange={(e) => handleGradeChange('s2', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Speaking 3</label>
                <input type="number" value={grades.s3} onChange={(e) => handleGradeChange('s3', e.target.value)} />
              </div>

              <div className={styles.gradeBox}>
                <label>Reading Quiz</label>
                <input type="number" value={grades.quiz} onChange={(e) => handleGradeChange('quiz', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>ALP (Proyecto)</label>
                <input type="number" value={grades.alp} onChange={(e) => handleGradeChange('alp', e.target.value)} />
              </div>
              <div className={styles.gradeBox}>
                <label>Examen Final</label>
                <input type="number" value={grades.final} onChange={(e) => handleGradeChange('final', e.target.value)} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: To-Do Tasks & Classroom Sync (Image 2 Right Panel) */}
        <div className={styles.rightCol}>
          
          {/* To-Do Tasks Widget */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Tareas de Classroom</h3>
              <span className={styles.taskCount}>3 Pendientes</span>
            </div>

            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>Writing #2: Opinion Essay</span>
                  <span className={styles.taskMeta}>Fecha límite: Mañana 11:59 PM</span>
                </div>
              </div>

              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>Speaking #2: Pair Presentation</span>
                  <span className={styles.taskMeta}>En clase de mañana</span>
                </div>
              </div>

              <div className={styles.taskItem}>
                <CheckCircle2 size={16} className={styles.taskIcon} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskName}>Reading Quiz - Unit 2</span>
                  <span className={styles.taskMeta}>Viernes 28 de Julio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Classroom Unit Files */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Materiales de Unidad</h3>
            </div>

            <div className={styles.fileList}>
              <div className={styles.fileItem}>
                <FileText size={18} className={styles.fileIcon} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>ICPNA_I06_Unit1.pdf</span>
                  <span className={styles.fileMeta}>12 Páginas • Classroom</span>
                </div>
              </div>

              <div className={styles.fileItem}>
                <FileText size={18} className={styles.fileIcon} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>Writing_2_Rubric.pdf</span>
                  <span className={styles.fileMeta}>3 Páginas • Classroom</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

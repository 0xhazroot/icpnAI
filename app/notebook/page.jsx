'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, UploadCloud, MessageSquare, ExternalLink, Code2 } from 'lucide-react';
import styles from './page.module.css';

export default function NotebookPage() {
  const [selectedUnit, setSelectedUnit] = useState('Unit 01');

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <div>
          <h1 className={styles.title}>NotebookLM Studio</h1>
          <p className={styles.subtitle}>Tus fuentes de estudio del ICPNA sincronizadas de Google Classroom y GitHub</p>
        </div>
        
        <div className={styles.unitTabs}>
          <button 
            className={`${styles.tabBtn} ${selectedUnit === 'Unit 01' ? styles.activeTab : ''}`}
            onClick={() => setSelectedUnit('Unit 01')}
          >
            Unit 01: Global Culture
          </button>
          <button 
            className={`${styles.tabBtn} ${selectedUnit === 'Unit 02' ? styles.activeTab : ''}`}
            onClick={() => setSelectedUnit('Unit 02')}
          >
            Unit 02: Technology & Future
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Source Files List */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Fuentes & PDFs de {selectedUnit}</h3>
            <span className={styles.badge}>3 Archivos Cargados</span>
          </div>

          <div className={styles.fileList}>
            <div className={styles.fileCard}>
              <div className={styles.fileHeader}>
                <FileText size={20} className={styles.pdfIcon} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>ICPNA_I06_Unit1_Vocabulary.pdf</span>
                  <span className={styles.fileMeta}>Classroom • 12 páginas • Hace 2 horas</span>
                </div>
              </div>
              <div className={styles.fileActions}>
                <button className={styles.btnAction}>
                  <Sparkles size={14} />
                  <span>Resumir con Gemini</span>
                </button>
                <button className={styles.btnActionSec}>
                  <MessageSquare size={14} />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            <div className={styles.fileCard}>
              <div className={styles.fileHeader}>
                <FileText size={20} className={styles.pdfIcon} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>Writing_2_Rubric_Guide.pdf</span>
                  <span className={styles.fileMeta}>Classroom • 3 páginas • Ayer</span>
                </div>
              </div>
              <div className={styles.fileActions}>
                <button className={styles.btnAction}>
                  <Sparkles size={14} />
                  <span>Resumir con Gemini</span>
                </button>
                <button className={styles.btnActionSec}>
                  <MessageSquare size={14} />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            <div className={styles.fileCard}>
              <div className={styles.fileHeader}>
                <Code2 size={20} className={styles.pdfIcon} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>github.com/samir/english-notes</span>
                  <span className={styles.fileMeta}>GitHub Repository • Sincronizado</span>
                </div>
              </div>
              <div className={styles.fileActions}>
                <button className={styles.btnActionSec}>
                  <ExternalLink size={14} />
                  <span>Ver Repositorio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div className={styles.uploadZone}>
            <UploadCloud size={32} className={styles.uploadIcon} />
            <span className={styles.uploadTitle}>Arrastra tus notas, PDFs o imágenes de ejercicios aquí</span>
            <span className={styles.uploadSub}>Soporta PDF, TXT, DOCX e Imágenes de tareas (PNG, JPG)</span>
          </div>
        </div>

        {/* Right Column: AI Document Assistant Summary Panel */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.aiTitle}>
              <Sparkles size={18} />
              <h3 className={styles.cardTitle}>Resumen Automático con Gemini</h3>
            </div>
            <span className={styles.modelTag}>Gemini 2.0 Flash</span>
          </div>

          <div className={styles.summaryContent}>
            <h4>Key Concepts for Unit 01 (Intermediate 06):</h4>
            <ul>
              <li><strong>Cultural Identity:</strong> Exploring traditions, language nuances, and globalization.</li>
              <li><strong>Target Grammar:</strong> Present Perfect Progressive vs. Present Perfect Simple.</li>
              <li><strong>Essential Vocabulary:</strong> <em>Heritage, assimilation, cultural exchange, perspective.</em></li>
            </ul>

            <div className={styles.promptBox}>
              <span className={styles.promptLabel}>Sugerencias de Estudio:</span>
              <div className={styles.promptChips}>
                <button className={styles.chip}>Generar Quiz de 5 preguntas</button>
                <button className={styles.chip}>Crear plantilla para Writing #2</button>
                <button className={styles.chip}>Practicar pronunciación del vocabulario</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

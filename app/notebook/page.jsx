'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  UploadCloud, 
  MessageSquare, 
  Trash2, 
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  PenTool,
  Volume2
} from 'lucide-react';
import styles from './page.module.css';

export default function NotebookPage() {
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState(null);
  const [aiOutput, setAiOutput] = useState('');
  const [loadingAction, setLoadingAction] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef(null);

  // Handle Drag & Drop Upload
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type.includes('pdf') ? 'PDF Document' : 'Image/Notes',
      textPreview: `Contenido cargado de ${file.name}`
    }));

    setSources(prev => [...prev, ...newFiles]);
    if (!activeSource && newFiles.length > 0) {
      setActiveSource(newFiles[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
    if (activeSource?.id === id) {
      setActiveSource(null);
      setAiOutput('');
    }
  };

  // Run Real Gemini API Action
  const runAiAction = async (actionType, sourceObj) => {
    setLoadingAction(actionType);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          text: sourceObj ? sourceObj.textPreview : 'Archivos de estudio del ICPNA',
          fileName: sourceObj ? sourceObj.name : 'Material de Clase'
        })
      });

      const data = await res.json();
      if (data.result) {
        setAiOutput(data.result);
      } else {
        setAiOutput('Error al generar respuesta con Gemini: ' + (data.error || 'Respuesta vacía'));
      }
    } catch (err) {
      console.error(err);
      setAiOutput('Error de conexión con la API de Gemini.');
    } finally {
      setLoadingAction('');
    }
  };

  // Chat with active document
  const handleDocChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoadingAction('chat');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: activeSource ? `Document: ${activeSource.name}` : ''
        })
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sin respuesta' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar la consulta.' }]);
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <div>
          <h1 className={styles.title}>NotebookLM Studio</h1>
          <p className={styles.subtitle}>Sube tus fuentes del ICPNA y procesa resúmenes, preguntas y quizzes con Gemini API</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Real Sources & Uploader */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Fuentes Cargadas</h3>
            <span className={styles.badge}>{sources.length} Archivos</span>
          </div>

          {sources.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={32} className={styles.emptyIcon} />
              <p>No has subido ningún documento todavía.</p>
              <span>Arrastra abajo tus tareas, PDFs o fotos de ejercicios para empezar.</span>
            </div>
          ) : (
            <div className={styles.fileList}>
              {sources.map(source => (
                <div 
                  key={source.id} 
                  className={`${styles.fileCard} ${activeSource?.id === source.id ? styles.activeFileCard : ''}`}
                  onClick={() => setActiveSource(source)}
                >
                  <div className={styles.fileHeader}>
                    <FileText size={20} className={styles.pdfIcon} />
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{source.name}</span>
                      <span className={styles.fileMeta}>{source.type} • {source.size}</span>
                    </div>
                  </div>
                  <div className={styles.fileActions}>
                    <button 
                      className={styles.btnAction}
                      onClick={(e) => { e.stopPropagation(); runAiAction('summary', source); }}
                    >
                      <Sparkles size={13} />
                      <span>Resumir</span>
                    </button>
                    <button 
                      className={styles.btnDelete}
                      onClick={(e) => { e.stopPropagation(); removeSource(source.id); }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Real Upload Drop Zone */}
          <input 
            type="file" 
            ref={fileInputRef}
            multiple 
            accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <div className={styles.uploadZone} onClick={triggerFileInput}>
            <UploadCloud size={32} className={styles.uploadIcon} />
            <span className={styles.uploadTitle}>Subir PDFs, Trabajos o Imágenes del ICPNA</span>
            <span className={styles.uploadSub}>Haz clic para explorar o arrastra tus archivos aquí</span>
          </div>
        </div>

        {/* Right Column: AI Output & Interactive Quiz Generator */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.aiTitle}>
              <Sparkles size={18} />
              <h3 className={styles.cardTitle}>Asistente Interactivo de Estudio</h3>
            </div>
            <span className={styles.modelTag}>Gemini 1.5 Flash</span>
          </div>

          <div className={styles.actionButtonsRow}>
            <button 
              className={styles.actionBtn}
              onClick={() => runAiAction('quiz', activeSource)}
              disabled={loadingAction === 'quiz'}
            >
              <HelpCircle size={14} />
              <span>{loadingAction === 'quiz' ? 'Generando Quiz...' : 'Generar Quiz (5 Preguntas)'}</span>
            </button>

            <button 
              className={styles.actionBtn}
              onClick={() => runAiAction('writing_template', activeSource)}
              disabled={loadingAction === 'writing_template'}
            >
              <PenTool size={14} />
              <span>Plantilla Writing #2</span>
            </button>

            <button 
              className={styles.actionBtn}
              onClick={() => runAiAction('pronunciation', activeSource)}
              disabled={loadingAction === 'pronunciation'}
            >
              <Volume2 size={14} />
              <span>Guía Pronunciación</span>
            </button>
          </div>

          {/* Gemini AI Generated Output Container */}
          <div className={styles.outputBox}>
            {loadingAction && loadingAction !== 'chat' ? (
              <div className={styles.loadingBox}>
                <RefreshCw size={18} className={styles.spinIcon} />
                <span>Procesando solicitud con Google Gemini...</span>
              </div>
            ) : aiOutput ? (
              <pre className={styles.formattedText}>{aiOutput}</pre>
            ) : (
              <div className={styles.outputPlaceholder}>
                <p>Selecciona una fuente y presiona un botón arriba para generar resúmenes o preguntas reales.</p>
              </div>
            )}
          </div>

          {/* Interactive Document Chat */}
          <div className={styles.docChatSection}>
            <div className={styles.chatHistorySmall}>
              {chatMessages.map((m, idx) => (
                <div key={idx} className={m.role === 'user' ? styles.chatUser : styles.chatAi}>
                  <strong>{m.role === 'user' ? 'Tú:' : 'Gemini:'}</strong> {m.content}
                </div>
              ))}
            </div>

            <div className={styles.chatInputWrapper}>
              <input 
                type="text" 
                placeholder={activeSource ? `Preguntar sobre ${activeSource.name}...` : 'Sube un PDF para chatear con él...'}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDocChat()}
                className={styles.chatInput}
              />
              <button onClick={handleDocChat} className={styles.chatSendBtn}>
                <MessageSquare size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

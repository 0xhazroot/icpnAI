'use client';

import React, { useState, useRef } from 'react';
import { 
  Archive, 
  FolderPlus, 
  FileText, 
  Search, 
  Sparkles, 
  UploadCloud, 
  Trash2, 
  BookMarked,
  Filter
} from 'lucide-react';
import styles from './page.module.css';

export default function VaultPage() {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [vaultFiles, setVaultFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const phases = ['All', 'Basic (B01-B12)', 'Intermediate (I01-I12)', 'Advanced (A01-A06)'];

  const handleUploadVaultFile = (files) => {
    const newItems = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      title: file.name,
      phase: selectedPhase === 'All' ? 'Intermediate (I01-I12)' : selectedPhase,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      date: new Date().toLocaleDateString()
    }));

    setVaultFiles(prev => [...prev, ...newItems]);
  };

  const removeVaultFile = (id) => {
    setVaultFiles(prev => prev.filter(f => f.id !== id));
  };

  const runHistoricalSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Busca en el archivo histórico de ciclos pasados del ICPNA lo siguiente: ${searchQuery}`
        })
      });

      const data = await res.json();
      setAiAnalysis(data.reply || 'Sin resultados en el histórico.');
    } catch (err) {
      setAiAnalysis('Error de búsqueda en el archivo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVault = vaultFiles.filter(item => {
    const matchesPhase = selectedPhase === 'All' || item.phase === selectedPhase;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesQuery;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Baúl Académico</h1>
          <p className={styles.subtitle}>Archivo histórico personal de PDFs, exámenes y tareas de tus ciclos pasados en el ICPNA</p>
        </div>

        <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
          <FolderPlus size={16} />
          <span>Agregar PDF de Ciclo Pasado</span>
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept=".pdf,.png,.jpg,.docx"
          style={{ display: 'none' }}
          onChange={(e) => handleUploadVaultFile(e.target.files)}
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por gramática, vocabulario o ciclo (ej. Intermediate 05)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && runHistoricalSearch()}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.phaseTabs}>
          {phases.map((p) => (
            <button 
              key={p} 
              className={`${styles.tabBtn} ${selectedPhase === p ? styles.activeTab : ''}`}
              onClick={() => setSelectedPhase(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Vault PDF Repository */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Repositorio de Ciclos ({filteredVault.length})</h3>
            <Filter size={16} />
          </div>

          {filteredVault.length === 0 ? (
            <div className={styles.emptyVault}>
              <Archive size={40} className={styles.vaultIcon} />
              <h4>Baúl Académico Vacío</h4>
              <p>Sube aquí tus guías, libros o proyectos de ciclos pasados del ICPNA para consultarlos con Gemini cuando lo necesites.</p>
            </div>
          ) : (
            <div className={styles.vaultList}>
              {filteredVault.map((item) => (
                <div key={item.id} className={styles.vaultItem}>
                  <div className={styles.itemHeader}>
                    <BookMarked size={20} className={styles.pdfIcon} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemMeta}>{item.phase} • {item.size} • {item.date}</span>
                    </div>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => removeVaultFile(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Drop Zone */}
          <div className={styles.dropZone} onClick={() => fileInputRef.current?.click()}>
            <UploadCloud size={24} />
            <span>Haz clic para guardar un nuevo documento en el Baúl</span>
          </div>
        </div>

        {/* Right Column: AI Historical Search & Analysis */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.aiTitle}>
              <Sparkles size={18} />
              <h3 className={styles.cardTitle}>Búsqueda Histórica con Gemini</h3>
            </div>
          </div>

          <p className={styles.aiDesc}>
            Pregúntale a Gemini sobre conceptos aprendidos en ciclos anteriores (ej. *"¿En qué ciclo vi Passive Voice?"* o *"Resumen de conectores de I04"*).
          </p>

          <div className={styles.aiBox}>
            {loading ? (
              <div className={styles.loadingState}>Buscando en tu Baúl Académico...</div>
            ) : aiAnalysis ? (
              <p className={styles.aiText}>{aiAnalysis}</p>
            ) : (
              <span className={styles.placeholderText}>Escribe una consulta en el buscador de arriba y presiona Enter.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

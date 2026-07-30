'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, GraduationCap, RefreshCw } from 'lucide-react';
import styles from './page.module.css';

export default function JarvisPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello Samir! I am JARVIS, your virtual ICPNA English professor. I have loaded your Intermediate 06 syllabus and Unit 1 materials. How can I assist your Speaking or Writing today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, level: 'ICPNA Intermediate 06' })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an issue. Let us try again!' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error with Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>JARVIS AI Professor</h1>
          <p className={styles.subtitle}>Tutor virtual de inglés impulsado por Gemini 2.0 API para ICPNA Intermediate 06</p>
        </div>
        <div className={styles.statusBadge}>
          <Sparkles size={14} />
          <span>Gemini 2.0 Flash Activo</span>
        </div>
      </div>

      <div className={styles.chatCard}>
        <div className={styles.chatHistory}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.aiRow}`}
            >
              <div className={styles.avatar}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.msgBubble}>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageRow} ${styles.aiRow}`}>
              <div className={styles.avatar}><Bot size={16} /></div>
              <div className={styles.msgBubbleLoading}>
                <RefreshCw size={14} className={styles.spinner} />
                <span>JARVIS está analizando...</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            placeholder="Pregúntale a JARVIS sobre rúbricas, vocabulario, corrección de ensayos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className={styles.input}
          />
          <button onClick={handleSend} disabled={loading} className={styles.sendBtn}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { 
  Save, 
  FileText, 
  Copy, 
  Trash2, 
  Edit, 
  Download, 
  Clock,
  Volume2,
} from 'lucide-react';
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";

export default function KahiniEditor() {
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [languages] = useState(["English", "Bengali", "Hindi", "Spanish", "Arabic"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Bengali");
  const [showTranslation, setShowTranslation] = useState(false);
  const textareaRef = useRef(null);

  const { targetText, isLoading, error } = useTranslate(
    showTranslation ? text : '', 
    selectedLanguage
  );

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  // Load saved texts on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('kahiniTexts');
    if (savedData) {
      setSavedTexts(JSON.parse(savedData));
    }
  }, []);

  const handleSave = () => {
    if (text.trim()) {
      const newSavedText = {
        id: Date.now(),
        content: text,
        timestamp: new Date().toLocaleString()
      };
      const updatedTexts = [...savedTexts, newSavedText];
      setSavedTexts(updatedTexts);
      localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
      
      // Reset fields
      setText('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(showTranslation ? targetText : text);
  };

  const handleDownload = () => {
    const content = showTranslation ? targetText : text;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
  };

  const handleAudioPlayback = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  };

  const handleDelete = (id) => {
    const updatedTexts = savedTexts.filter(item => item.id !== id);
    setSavedTexts(updatedTexts);
    localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
  };

  const handleEdit = (savedText) => {
    setSelectedText(savedText);
    setText(savedText.content);
    setIsEditMode(true);
  };

  const handleUpdateSavedText = () => {
    if (selectedText) {
      const updatedTexts = savedTexts.map(item => 
        item.id === selectedText.id 
          ? { ...item, content: text } 
          : item
      );
      setSavedTexts(updatedTexts);
      localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
      
      // Reset edit mode
      setIsEditMode(false);
      setSelectedText(null);
      setText('');
    }
  };

  return (
    <div className={styles.redesignedContainer}>
      <div className={styles.editorSection}>
        <div className={styles.editorWrapper}>
          <textarea 
            ref={textareaRef}
            className={styles.textArea} 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing your story..."
            rows={5}
          />

          <div className={styles.editorControls}>
            <div className={styles.languageSelectorWrapper}>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                languages={languages}
              />
              <button 
                className={styles.translateButton}
                onClick={() => setShowTranslation(!showTranslation)}
              >
                Translate
              </button>
            </div>

            <div className={styles.actionButtons}>
              {isEditMode ? (
                <button 
                  onClick={handleUpdateSavedText}
                  className={styles.smallButton}
                >
                  Update
                </button>
              ) : (
                <button 
                  onClick={handleSave} 
                  className={styles.smallButton}
                >
                  <Save size={16} />
                </button>
              )}
              <button 
                onClick={handleCopy} 
                className={styles.smallButton}
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={handleDownload} 
                className={styles.smallButton}
              >
                <Download size={16} />
              </button>
              <button 
                onClick={() => handleAudioPlayback(text)} 
                className={styles.smallButton}
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {showTranslation && (
            <div className={styles.translationWrapper}>
              <textarea 
                className={styles.translatedTextArea}
                value={isLoading ? "Translating..." : targetText || ""}
                readOnly
                placeholder={error || "Translation will appear here"}
              />
              {targetText && (
                <div className={styles.translationActions}>
                  <button 
                    onClick={() => handleAudioPlayback(targetText)}
                    className={styles.smallButton}
                  >
                    <Volume2 size={16} />
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(targetText)}
                    className={styles.smallButton}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.savedSection}>
        <h2 className={styles.savedTitle}>
          <FileText size={20} /> Saved Stories
        </h2>
        {savedTexts.length === 0 ? (
          <p className={styles.emptyState}>No stories saved yet</p>
        ) : (
          savedTexts.map((savedText) => (
            <div key={savedText.id} className={styles.savedTextItem}>
              <p className={styles.savedTextContent}>{savedText.content}</p>
              <div className={styles.savedTextMeta}>
                <span className={styles.timestamp}>
                  <Clock size={12} /> {savedText.timestamp}
                </span>
                <div className={styles.actionIcons}>
                  <button 
                    onClick={() => handleEdit(savedText)}
                    className={styles.smallButton}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(savedText.id)}
                    className={styles.smallButton}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
'use client';

import "regenerator-runtime/runtime";
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
  Star
} from 'lucide-react';
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";

export default function KahiniEditor() {
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [languages] = useState(["English", "Bengali", "Hindi", "Spanish", "Arabic"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Bengali");
  const textareaRef = useRef(null);

  const { targetText, isLoading, error } = useTranslate(text, selectedLanguage);

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
    navigator.clipboard.writeText(targetText || text);
  };

  const handleDownload = () => {
    const content = targetText || text;
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

  const handleFavorite = () => {
    setFavorite(!favorite);
    const content = targetText || text;
    if (!favorite) {
      localStorage.setItem('favoriteStory', content);
    } else {
      localStorage.removeItem('favoriteStory');
    }
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
    <div className={styles.container}>
      <div className={styles.editorWrapper}>
        <textarea 
          ref={textareaRef}
          className={styles.textArea} 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing your story..."
          rows={5}
        />

        <div className={styles.actionButtons}>
          {isEditMode ? (
            <button 
              onClick={handleUpdateSavedText}
              className={styles.updateButton}
            >
              Update Story
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className={styles.saveButton}
              title="Save"
            >
              <Save size={20} /> Save
            </button>
          )}
          <button 
            onClick={handleCopy} 
            className={styles.copyButton}
            title="Copy"
          >
            <Copy size={20} /> Copy
          </button>
          <button 
            onClick={handleDownload} 
            className={styles.downloadButton}
            title="Download"
          >
            <Download size={20} /> Download
          </button>
          <button 
            onClick={() => handleAudioPlayback(text)} 
            className={styles.audioButton}
            title="Read Aloud"
          >
            <Volume2 size={20} /> Read
          </button>
          <button 
            onClick={handleFavorite} 
            className={`${styles.favoriteButton} ${favorite ? styles.activeFavorite : ''}`}
            title="Favorite"
          >
            <Star size={20} /> 
          </button>
        </div>

        <div className={styles.languageSelector}>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
          />
        </div>
      </div>

      {(targetText || isLoading || error) && (
        <div className={styles.translationWrapper}>
          <h3>Translated Text</h3>
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
                className={styles.audioButton}
                title="Read Translated Text"
              >
                <Volume2 size={20} />
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(targetText)}
                className={styles.copyButton}
                title="Copy Translation"
              >
                <Copy size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.savedTexts}>
        <h2 className={styles.savedTitle}>
          <FileText size={24} /> Saved Stories
        </h2>
        {savedTexts.length === 0 ? (
          <p className={styles.emptyState}>No stories saved yet</p>
        ) : (
          savedTexts.map((savedText) => (
            <div key={savedText.id} className={styles.savedTextItem}>
              <p>{savedText.content}</p>
              <div className={styles.savedTextMeta}>
                <div className={styles.metaDetails}>
                  <span className={styles.timestamp}>
                    <Clock size={14} /> {savedText.timestamp}
                  </span>
                </div>
                <div className={styles.actionIcons}>
                  <button 
                    onClick={() => handleEdit(savedText)}
                    className={styles.editButton}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(savedText.id)}
                    className={styles.deleteButton}
                    title="Delete"
                  >
                    <Trash2 size={16} />
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
//path='src/app/blog/page.jsx'
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import {
  Save, FileText, Copy, Trash2, Edit, Download, Clock, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Heading1, Quote,
  Mic
} from 'lucide-react';
import useTranslate from "@/hooks/useTranslate";
import '@fontsource/inter'; // Import Inter font
// import '@fontsource/arial';
// Import Arial font
//import '@fontsource/times-new-roman'; // Custom package for Times New Roman (optional)
import '@fontsource/roboto'; // Example: Add another font
// import '@fontsource/noto-sans-bengali';


export default function KahiniEditor() {
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [languages] = useState(["English", "Bengali", "Hindi", "Spanish", "Arabic"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Bengali");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // New font-related states
  const [fonts] = useState([
    'Inter',
    'Arial',
    'Times New Roman',
    'Roboto', // Example: Added Roboto
    'Verdana',
    'Georgia',
    'Helvetica',
    'Courier New',
    'Ubuntu', // Default font on Ubuntu systems
    'DejaVu Sans',
    'DejaVu Serif',
    'DejaVu Sans Mono', // Monospace font
    'Liberation Sans',
    'Liberation Serif',
    'Liberation Mono',
    'Noto Sans', // Common fallback font
    'Cantarell', // Fedora-based font, also available on many Linux systems
    'Noto Sans Bengali', // Preferred Bangla font
    'Noto Serif Bengali', // Elegant serif Bangla font
    'Lohit Bengali', // System-friendly Bangla font
    'Mukta Malar', // Another modern Bangla font
    'SolaimanLipi' // Popular manually-installed Bangla font
  ]);

  const [selectedFont, setSelectedFont] = useState('Inter');
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const fontDropdownRef = useRef(null);

  const { targetText, isLoading, error } = useTranslate(
    showTranslation ? text : '',
    selectedLanguage
  );

  // Speech Recognition Logic
  const startListening = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListening(true);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const editor = editorRef.current;

      // Insert text at current cursor position or append
      if (editor) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(transcript + ' ');
        range.insertNode(textNode);

        // Update text state
        setText(editor.innerHTML);
      }

      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (fontDropdownRef.current &&
        !fontDropdownRef.current.contains(event.target)) {
        setShowFontDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Text Formatting Functions
  const applyFormatting = (formatType) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let formattedText = document.createElement('span');
    switch (formatType) {
      case 'bold':
        formattedText.style.fontWeight = 'bold';
        break;
      case 'italic':
        formattedText.style.fontStyle = 'italic';
        break;
      case 'underline':
        formattedText.style.textDecoration = 'underline';
        break;
      case 'quote':
        formattedText.style.fontStyle = 'italic';
        formattedText.style.borderLeft = '2px solid #ccc';
        formattedText.style.paddingLeft = '8px';
        break;
      case 'heading':
        formattedText.style.fontSize = '1.5em';
        formattedText.style.fontWeight = 'bold';
        break;
      case 'bulletList':
        formattedText = document.createElement('ul');
        selectedText.split('\n').forEach(line => {
          const li = document.createElement('li');
          li.textContent = line;
          formattedText.appendChild(li);
        });
        break;
      case 'numberedList':
        formattedText = document.createElement('ol');
        selectedText.split('\n').forEach((line, index) => {
          const li = document.createElement('li');
          li.textContent = line;
          formattedText.appendChild(li);
        });
        break;
    }

    if (['bulletList', 'numberedList'].includes(formatType)) {
      range.deleteContents();
      range.insertNode(formattedText);
    } else {
      formattedText.textContent = selectedText;
      range.deleteContents();
      range.insertNode(formattedText);
    }

    // Update the text state
    setText(editor.innerHTML);
  };

  // Core Functions
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
    link.download = `story_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
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
      setIsEditMode(false);
      setSelectedText(null);
      setText('');
    }
  };

  return (
    <div className={styles.redesignedContainer}>
      <div className={styles.editorSection}>
        <div className={styles.editorWrapper}>
          {/* Text Editor Toolbar */}
          <div className={styles.editorToolbar}>
            <div className={styles.toolbarGroup}>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('bold')}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('italic')}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('underline')}
                title="Underline"
              >
                <Underline size={16} />
              </button>
            </div>

            <div className={styles.toolbarGroup}>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('heading')}
                title="Heading"
              >
                <Heading1 size={16} />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('quote')}
                title="Quote"
              >
                <Quote size={16} />
              </button>
            </div>

            <div className={styles.toolbarGroup}>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('bulletList')}
                title="Bullet List"
              >
                <List size={16} />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => applyFormatting('numberedList')}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </button>
            </div>

            {/* Font Selector */}
            <div
              className={styles.toolbarGroup}
              ref={fontDropdownRef}
            >
              <div
                className={styles.languageSelector}
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                style={{ fontFamily: selectedFont }}
              >
                {selectedFont}
                <ChevronDown size={16} />
              </div>
              {showFontDropdown && (
                <div className={styles.languageDropdown}>
                  {fonts.map(font => (
                    <div
                      key={font}
                      className={styles.languageOption}
                      style={{ fontFamily: font }}
                      onClick={() => {
                        setSelectedFont(font);
                        setShowFontDropdown(false);

                        // Apply font to entire editor
                        if (editorRef.current) {
                          editorRef.current.style.fontFamily = font;
                        }
                      }}
                    >
                      {font}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor with dynamic font */}
          <div
            ref={editorRef}
            className={styles.textArea}
            contentEditable
            style={{ fontFamily: selectedFont }}
            onInput={(e) => setText(e.target.innerHTML)}
            placeholder="Start writing your story..."
          />

          {/* Voice-to-Text Button */}
          <div className={styles.voiceToTextWrapper}>
            <button
              className={`${styles.voiceToTextButton} ${isListening ? styles.active : ''}`}
              onClick={startListening}
              disabled={isListening}
              title="Voice to Text"
            >
              <Mic size={16} />
              {isListening ? "Listening..." : ""}
            </button>
          </div>

          {/* Language Selector and Action Buttons */}
          <div className={styles.editorControls}>
            <div className={styles.languageSelectorWrapper} ref={languageDropdownRef}>
              <div
                className={styles.languageSelector}
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {selectedLanguage}
                <ChevronDown size={16} />
              </div>
              {showLanguageDropdown && (
                <div className={styles.languageDropdown}>
                  {languages.map(lang => (
                    <div
                      key={lang}
                      className={styles.languageOption}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
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
            </div>
          </div>

          {/* Translation Section */}
          {showTranslation && targetText && (
            <div className={styles.compactTranslationWrapper}>
              <textarea
                className={styles.translatedTextArea}
                value={isLoading ? "Translating..." : targetText || ""}
                readOnly
                placeholder={error || "Translation"}
              />
              <div className={styles.translationActions}>
                <button
                  onClick={() => navigator.clipboard.writeText(targetText)}
                  className={styles.smallButton}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Stories Section */}
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


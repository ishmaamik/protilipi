"use client";
import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { IconCopy, IconStar, IconVolume } from "@tabler/icons-react";
import FileUpload from "@/components/Inputs/FileUpload";
import useTranslate from "@/hooks/useTranslate";
import styles from "./page.module.css";

const Home = () => {
  const [sourceText, setSourceText] = useState("");
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [languages] = useState(["English", "Spanish", "French", "German", "Chinese"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");

  const { targetText, isLoading, error } = useTranslate(sourceText, selectedLanguage);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", targetText);
    } else {
      localStorage.removeItem("favoriteTranslation");
    }
  };

  const handleAudioPlayback = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          body: file,
        });

        if (response.ok) {
          const { text } = await response.json();
          setSourceText(text); // Set extracted text to sourceText
        } else {
          console.error("Failed to extract text from PDF");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceText(reader.result); // For non-PDF files
      };
      reader.readAsText(file);
    }
  };
  

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          Lingua<span className={styles.headerHighlight}>Speak</span>
        </h1>
        <p className={styles.headerSubtitle}>
          LinguaSpeak: Bridging Voices, Connecting Worlds.
        </p>
      </header>

      <div className={styles.translationContainer}>
        {/* Source Language */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Source Language</h2>
          <textarea
            className={styles.textarea}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text or upload a file"
          />
          <div className={styles.cardFooter}>
            <FileUpload handleFileUpload={handleFileUpload} />
            <span className={styles.charCount}>{sourceText.length} / 2000</span>
          </div>
        </div>

        {/* Target Language */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Target Language</h2>
          <textarea
            className={styles.textarea}
            value={isLoading ? "Translating..." : targetText || ""}
            readOnly
            placeholder={error || "Translation will appear here"}
          />
          <div className={styles.cardFooter}>
            <div className={styles.icons}>
              <IconVolume onClick={() => handleAudioPlayback(targetText)} className={styles.icon} />
              <IconCopy onClick={handleCopyToClipboard} className={styles.icon} />
              <IconStar
                onClick={handleFavorite}
                className={`${styles.icon} ${favorite ? styles.activeIcon : ""}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

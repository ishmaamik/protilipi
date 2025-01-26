"use client";
import "regenerator-runtime/runtime";
import React, { useState } from "react";
import Tesseract from "tesseract.js"; // Import Tesseract.js
import { IconCopy, IconStar, IconVolume } from "@tabler/icons-react";
import FileUpload from "@/components/Inputs/FileUpload";
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";
import styles from "./page.module.css";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";

const Home = () => {
  const [sourceText, setSourceText] = useState("");
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [languages] = useState(["English", "Spanish", "French", "German", "Chinese", "Bengali"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [extractedText, setExtractedText] = useState(""); // Holds extracted OCR text
  const [loading, setLoading] = useState(false); // Loading state for OCR processing

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
  
    if (!file) {
      alert("Please upload a valid file.");
      return;
    }
  
    try {
      setLoading(true); // Start loading spinner
  
      if (file.type === "application/pdf") {
        // Handle PDF file
        const fileReader = new FileReader();
  
        fileReader.onload = async () => {
          const pdfData = new Uint8Array(fileReader.result); // Convert to ArrayBuffer
  
          // Load and process the PDF using Tesseract.js
          const pdf = await Tesseract.recognize(pdfData, "eng+ben", {
            logger: (info) => console.log(info), // Optional: log progress
            tessedit_pageseg_mode: 6, // Treat as a single uniform block of text
          });
  
          setSourceText(pdf.data.text.replace(/\n/g, " ")); // Replace newlines with spaces for a single-line result
          setLoading(false); // Stop loading spinner
        };
  
        fileReader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
      } else if (file.type.includes("image")) {
        // Handle image file
        const fileReader = new FileReader();
  
        fileReader.onload = async () => {
          const image = fileReader.result; // Base64 of the image
  
          // Perform OCR using Tesseract.js
          const { data } = await Tesseract.recognize(image, "eng+ben",{
            logger: (info) => console.log(info), // Optional: log progress
            tessedit_pageseg_mode: 6, // Treat as a single uniform block of text
          });
  
          setSourceText(data.text.replace(/\n/g, " ")); // Replace newlines with spaces for a single-line result
          setLoading(false); // Stop loading spinner
        };
  
        fileReader.readAsDataURL(file); // Read the file as Base64
      } else {
        alert("Unsupported file type. Please upload an image or a PDF.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing the file:", error);
      alert("An error occurred while processing the file. Please try again.");
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.page}>
      {/* Header Section */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          Lingua<span className={styles.headerHighlight}>Speak</span>
        </h1>
        <p className={styles.headerSubtitle}>LinguaSpeak: Bridging Voices, Connecting Worlds.</p>
      </header>

      {/* Translation Cards */}
      <div className={styles.translationContainer}>
        {/* Source Language */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Source Language</h2>
          <textarea
            className={styles.textarea}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate"
          />
          <div className={styles.cardFooter}>
            <div className={styles.icons}>
              <SpeechRecognitionComponent setSourceText={setSourceText} />
              <FileUpload handleFileUpload={handleFileUpload} />
            </div>
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
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              languages={languages}
            />
            <div className={styles.icons}>
              <IconVolume
                onClick={() => handleAudioPlayback(targetText)}
                className={styles.icon}
              />
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

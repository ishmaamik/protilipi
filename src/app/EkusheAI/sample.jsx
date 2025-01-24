"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

export default function VoiceChatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bn-BD'; // Set default to Bangla

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        
        // Detect language
        try {
          const langResponse = await axios({
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCgyhYId0cuciUwpt_VL8yQVgrj9NKDVho`,
            method: "post",
            data: {
              contents: [{ 
                parts: [{ 
                  text: `Detect the language of this text. Respond with ONLY 'Bangla' or 'English': ${transcript}` 
                }] 
              }],
            },
          });

          const detectedLang = langResponse.data.candidates[0].content.parts[0].text.trim();
          
          setQuestion(transcript);
          setIsListening(false);
        } catch (error) {
          console.error('Language detection error:', error);
          setQuestion(transcript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported');
    }
  };

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;
    
    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion('');
    
    setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);
    
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCgyhYId0cuciUwpt_VL8yQVgrj9NKDVho`,
        method: "post",
        data: {
          contents: [{ 
            parts: [{ 
              text: `Develop a chatbot that can understand and respond to user queries in both Bangla and Banglish. The chatbot should detect the language or code-switching in user input and provide responses entirely in Bangla. It should also handle mixed Banglish sentences where users may combine Bangla and English in their queries. The system should support a variety of common conversational contexts like greetings, FAQs, and simple commands. 
              If the input is in Bangla, respond in Bangla. 
              If the input is in English, respond in English: ${currentQuestion}` 
            }] 
          }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        type: 'answer', 
        content: "দুঃখিত, কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন!" 
      }]);
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotWrapper}>
        <div className={styles.chatbotCard}>
          <div className={styles.chatbotHeader}>
            <h1>একুশে AI</h1>
            <p>আপনার কথোপকথন সঙ্গী</p>
          </div>
          
          <div 
            ref={chatContainerRef}
            className={styles.chatContainer}
          >
            {chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`${styles.chatMessage} ${chat.type === 'question' ? styles.questionMessage : styles.answerMessage}`}
              >
                <div className={styles.messageContent}>
                  {chat.content}
                </div>
              </div>
            ))}

            {generatingAnswer && (
              <div className={styles.thinkingIndicator}>
                চিন্তা করছে...
              </div>
            )}
          </div>
          
          <form onSubmit={generateAnswer} className={styles.inputForm}>
            <div className={styles.inputWrapper}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="আমাকে কিছু জিজ্ঞেস করুন..."
                rows={2}
                disabled={generatingAnswer}
                className={styles.inputTextarea}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateAnswer(e);
                  }
                }}
              />
              <div className={styles.buttonGroup}>
                <button 
                  type="submit" 
                  disabled={generatingAnswer}
                  className={styles.sendButton}
                >
                  পাঠান
                </button>
                <button
                type="button"
                onClick={startVoiceInput}
                disabled={generatingAnswer || isListening}
                className={`${styles.voiceButton} ${isListening ? styles.listeningButton : ''}`}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function BanglaChatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

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
              text: `Please answer the following question in Bangla (Bengali language). 
              If the question is in English or Banglish, translate it to Bangla first and then answer. 
              Your response must be entirely in Bangla script: ${currentQuestion}` 
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
              <button 
                type="submit" 
                disabled={generatingAnswer}
                className={styles.sendButton}
              >
                পাঠান
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
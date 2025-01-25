import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (sourceText) => {
      try {
        const genAI = new GoogleGenerativeAI(
          "AIzaSyBQ-KCx7JC2ksgGCEIKosnfDNqzl6qgf2w"
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You will be provided with a sentence. This sentence: 
        ${sourceText}. Your tasks are to:
        - Detect what language the sentence is in
        - Translate the sentence into ${selectedLanguage}
        Do not return anything other than the translated sentence.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const data = response.text();

        console.log("Translated text:", data);
        setTargetText(data);
      } catch (error) {
        console.error("Error translating text:", error);
      }
    };

    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, selectedLanguage]);

  return targetText;
};

export default useTranslate;

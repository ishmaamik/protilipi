import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleTranslate = async () => {
      if (!sourceText.trim()) {
        setTargetText("");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const genAI = new GoogleGenerativeAI(
          "AIzaSyBQ-KCx7JC2ksgGCEIKosnfDNqzl6qgf2w" // Ensure the API key is valid
        );

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You will be provided with a sentence. This sentence: 
        ${sourceText}. Your tasks are to:
        - Detect what language the sentence is in
        - Translate the sentence into ${selectedLanguage}.
        Return only the translated sentence.`;

        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
          throw new Error("Invalid response from Google Generative AI");
        }

        const response = result.response;
        const translatedText = response.text();

        console.log("Translated text:", translatedText);
        setTargetText(translatedText);
      } catch (err) {
        console.error("Error translating text:", err);
        setError("Translation failed. Please try again.");
        setTargetText("");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      handleTranslate();
    }, 500); // Debounce to prevent excessive API calls

    return () => clearTimeout(timeoutId);
  }, [sourceText, selectedLanguage]);

  return { targetText, isLoading, error };
};

export default useTranslate;

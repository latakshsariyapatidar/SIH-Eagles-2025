
import { useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { LANGUAGE_MAP } from '../constants';

export const useTextToSpeech = () => {
  const { isVoiceOn, language } = useAppContext();

  const speak = useCallback((text: string) => {
    if (!isVoiceOn || !text) return;
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_MAP[language];
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceOn, language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak };
};

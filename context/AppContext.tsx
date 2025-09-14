
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { FC } from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isVoiceOn: boolean;
  toggleVoice: () => void;
  getText: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isVoiceOn, setIsVoiceOn] = useState<boolean>(true);

  const toggleVoice = () => setIsVoiceOn(prev => !prev);
  
  const getText = (key: string): string => {
    return UI_TEXT[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, isVoiceOn, toggleVoice, getText }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

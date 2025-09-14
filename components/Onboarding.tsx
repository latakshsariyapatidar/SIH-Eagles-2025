
import React, { useState } from 'react';
import { Language } from '../types';

interface OnboardingProps {
  onComplete: (selectedLang: Language) => void;
}

const LanguageSelector: React.FC<{ selected: Language, onSelect: (lang: Language) => void }> = ({ selected, onSelect }) => {
  const languageFlags: { [key in Language]: string } = {
    [Language.EN]: '🇺🇸',
    [Language.HI]: '🇮🇳',
    [Language.PA]: '🇮🇳'
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.values(Language).map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 border-2 text-left ${
            selected === lang
              ? 'bg-gradient-to-r from-primary-500 to-secondary-400 text-zinc-900 border-transparent shadow-soft scale-105'
              : 'bg-gray-50 text-zinc-400 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-xl">{languageFlags[lang]}</span>
          <span className="flex-1">{lang}</span>
          {selected === lang && (
            <span className="text-white">✓</span>
          )}
        </button>
      ))}
    </div>
  );
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedLang, setSelectedLang] = useState<Language>(Language.EN);

  const TEXTS: { [key in Language]: { title: string, subtitle: string, select: string, button: string, description: string } } = {
    [Language.EN]: {
      title: 'Welcome to SmartAgri',
      subtitle: 'Your AI-powered farming assistant',
      description: 'Get expert agricultural advice, crop disease diagnosis, and real-time farming guidance using advanced AI technology.',
      select: 'Choose your preferred language:',
      button: 'Start Farming Smarter'
    },
    [Language.HI]: {
      title: 'स्मार्टएग्री में आपका स्वागत है',
      subtitle: 'आपका AI-संचालित खेती सहायक',
      description: 'उन्नत AI तकनीक का उपयोग करके विशेषज्ञ कृषि सलाह, फसल रोग निदान, और वास्तविक समय खेती मार्गदर्शन प्राप्त करें।',
      select: 'अपनी पसंदीदा भाषा चुनें:',
      button: 'स्मार्ट खेती शुरू करें'
    },
    [Language.PA]: {
      title: 'ਸਮਾਰਟਐਗਰੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
      subtitle: 'ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਹਾਇਕ',
      description: 'ਉੱਨਤ AI ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮਾਹਰ ਖੇਤੀਬਾੜੀ ਸਲਾਹ, ਫਸਲ ਰੋਗ ਨਿਦਾਨ, ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਖੇਤੀ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ।',
      select: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ:',
      button: 'ਚੁਸਤ ਖੇਤੀ ਸ਼ੁਰੂ ਕਰੋ'
    }
  };
  
  const currentTexts = TEXTS[selectedLang];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6 text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-100/20 to-teal-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-soft-lg max-w-sm w-full animate-bounce-in border border-white/50 relative z-10">
        {/* Logo and branding */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-2xl flex items-center justify-center shadow-soft-lg">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-balance">{currentTexts.title}</h1>
          <p className="text-black font-medium mb-3">{currentTexts.subtitle}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{currentTexts.description}</p>
        </div>

        {/* Language selection */}
        <div className="mb-8">
          <label className="block text-black mb-4 font-semibold text-sm">{currentTexts.select}</label>
          <LanguageSelector selected={selectedLang} onSelect={setSelectedLang} />
        </div>

        {/* Start button */}
        <button
          onClick={() => onComplete(selectedLang)}
          className="w-full bg-gradient-to-r from-secondary-400 to-primary-500 text-zinc-500 font-bold py-4 px-6 rounded-xl hover:from-secondary-500 hover:to-primary-600 transition-all duration-300 transform hover:scale-105 hover:shadow-soft-lg active:scale-95 focus-ring"
        >
          <span className="flex items-center justify-center gap-2">
            <span>{currentTexts.button}</span>
            <span>🚀</span>
          </span>
        </button>
        
        {/* Features preview */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-600">
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">📸</span>
            <span>Crop Analysis</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🤖</span>
            <span>AI Guidance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🌾</span>
            <span>Expert Tips</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

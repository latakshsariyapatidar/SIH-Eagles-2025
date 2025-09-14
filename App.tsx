
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import WeatherWidget from './components/WeatherWidget';
import CenterWeatherWidget from './components/CenterWeatherWidget';
import ChatInterface from './components/ChatInterface';
import ChatInput from './components/ChatInput';
import InitialScreen from './components/InitialScreen';
import Onboarding from './components/Onboarding';
import { ToastContainer } from './components/Toast';
import { AppProvider } from './context/AppContext';
import { useToast } from './hooks/useToast';
import { useChatContext } from './hooks/useChatContext';
import { getAdvisory } from './services/geminiService';
import type { Message, CardData } from './types';
// FIX: Import CardType and Urgency enums to use for cardData properties.
import { Language, CardType, Urgency } from './types';

function AppContent() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const { toasts, removeToast, showError, showSuccess } = useToast();
  const { 
    chatHistory, 
    addMessage: addToChatHistory, 
    addConversationTurn,
    getContextForAI,
    isLoading: chatLoading 
  } = useChatContext();

  // Use chat history from database instead of local state
  useEffect(() => {
    if (!chatLoading && chatHistory.length === 0) {
      // Don't add any welcome message, let the initial screen show instead
    }
  }, [chatLoading, chatHistory.length, addToChatHistory]);

  // Check if we should show the initial screen (no user messages sent)
  const shouldShowInitialScreen = chatHistory.length === 0 || 
    (chatHistory.length === 1 && chatHistory[0].sender === 'ai' && chatHistory[0].cardData?.title === 'Welcome to SmartAgri!');

  // Check if we should show center weather (no messages at all)
  const shouldShowCenterWeather = chatHistory.length === 0;

  const handleSendMessage = useCallback(async (text: string, image: { data: string; mimeType: string } | null) => {
    if (!text && !image) return;

    // Add user message to chat history for immediate UI update
    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      sender: 'user',
      ...(text && { text }),
      ...(image && { imageUrl: `data:${image.mimeType};base64,${image.data}` }),
    };
    
    const userMsg = addToChatHistory(userMessage);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Get conversation context for better AI responses
      const conversationContext = getContextForAI();
      
      const cardData = await getAdvisory(image, text, language, conversationContext);
      if (cardData) {
        // Add AI response to chat history (database storage is handled automatically)
        addToChatHistory({ sender: 'ai', cardData });
        
        showSuccess('Analysis complete! 🌱');
      } else {
        throw new Error('Failed to get a valid response from AI.');
      }
    } catch (error) {
      console.error('Error getting advisory:', error);
      showError('Sorry, I encountered an error. Please try again.');
      addToChatHistory({
        sender: 'system',
        text: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToChatHistory, language, showError, showSuccess, getContextForAI]);
  
  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action, null);
  }, [handleSendMessage]);

  const handleOnboardingComplete = (selectedLang: Language) => {
      setLanguage(selectedLang);
      setIsOnboarding(false);
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-gradient-to-b from-gray-50 to-chat-bg font-sans relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {isOnboarding ? (
        <div className="animate-fade-in">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      ) : (
        <div className="flex flex-col h-full animate-fade-in pb-32">
          <Header />
          {/* Show top weather widget only after first message */}
          {!shouldShowCenterWeather && <WeatherWidget />}
          
          {/* Show center weather initially, then switch to chat interface */}
          {shouldShowCenterWeather ? (
            <CenterWeatherWidget />
          ) : (
            <div className="flex-1 overflow-hidden">
              <ChatInterface 
                messages={chatHistory} 
                isLoading={isLoading} 
                onQuickAction={handleQuickAction}
              />
            </div>
          )}
          
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      )}
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../types';
import { chatDatabase } from '../services/chatDatabase';

export interface ChatContextMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useChatContext = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserMessage, setPendingUserMessage] = useState<Message | null>(null);

  // Load chat history from offline database on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const sessionId = chatDatabase.getCurrentSession();
        setConversationId(sessionId);
        
        // Load messages from current session
        const messages = chatDatabase.getSessionMessages(sessionId);
        setChatHistory(messages);
      } catch (error) {
        console.error('Error loading chat history from database:', error);
        setChatHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    
    // Handle database storage based on message type
    if (message.sender === 'user') {
      // Store user message temporarily
      setPendingUserMessage(newMessage);
    } else if (message.sender === 'ai' && pendingUserMessage) {
      // We have a user-AI pair, store it in database
      const userText = pendingUserMessage.text || 'Image analysis request';
      const aiText = message.cardData 
        ? `${message.cardData.title}: ${Array.isArray(message.cardData.content) ? message.cardData.content.join('. ') : message.cardData.content}`
        : message.text || 'AI response';
      
      const imageData = pendingUserMessage.imageUrl;
      
      try {
        chatDatabase.addConversationTurn(userText, aiText, imageData);
        console.log('✅ Conversation turn saved to database');
      } catch (error) {
        console.error('Error saving conversation to database:', error);
      }
      
      // Clear pending message
      setPendingUserMessage(null);
    }
    
    return newMessage;
  }, [pendingUserMessage]);

  const addConversationTurn = useCallback((
    userMessage: string,
    aiResponse: string,
    imageData?: string,
    metadata?: { tokens?: number; responseTime?: number; model?: string }
  ) => {
    try {
      // Store in offline database (don't update local state as messages are already there)
      const convId = chatDatabase.addConversationTurn(userMessage, aiResponse, imageData, metadata);
      return convId;
    } catch (error) {
      console.error('Error adding conversation turn to database:', error);
      return null;
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      // Save context before clearing
      chatDatabase.savePersistentContext();
      
      // Start new session in database
      const newSessionId = chatDatabase.startNewSession();
      setConversationId(newSessionId);
      
      // Check if we have persistent context for the new session
      const persistentContext = chatDatabase.getContextForNewSession();
      if (persistentContext) {
        // Add a welcome back message with context
        const contextMessage: Message = {
          id: `ctx_${Date.now()}`,
          text: "Welcome back! I remember our previous discussions and can provide more personalized advice.",
          sender: 'system',
          timestamp: Date.now()
        };
        setChatHistory([contextMessage]);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setChatHistory([]);
    }
  }, []);

  const getContextForAI = useCallback((): ChatContextMessage[] => {
    try {
      // Get context from offline database
      const dbContext = chatDatabase.getContextForAI(conversationId || undefined);
      
      // If no database context, try to get from current chat history
      if (dbContext.length === 0) {
        const recentMessages = chatHistory.slice(-10);
        const fallbackContext = recentMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text || (msg.cardData ? `${msg.cardData.title}: ${Array.isArray(msg.cardData.content) ? msg.cardData.content.join('. ') : msg.cardData.content}` : ''),
          timestamp: new Date(msg.timestamp).toISOString()
        }));
        
        return fallbackContext as ChatContextMessage[];
      }
      
      return dbContext;
    } catch (error) {
      console.error('Error getting context from database:', error);
      // Fallback to local chat history
      const recentMessages = chatHistory.slice(-10);
      return recentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text || (msg.cardData ? `${msg.cardData.title}: ${Array.isArray(msg.cardData.content) ? msg.cardData.content.join('. ') : msg.cardData.content}` : ''),
        timestamp: new Date(msg.timestamp).toISOString()
      })) as ChatContextMessage[];
    }
  }, [chatHistory, conversationId]);

  const getLastUserMessage = useCallback(() => {
    const userMessages = chatHistory.filter(msg => msg.sender === 'user');
    return userMessages[userMessages.length - 1];
  }, [chatHistory]);

  const getMessageCount = useCallback(() => {
    return {
      total: chatHistory.length,
      user: chatHistory.filter(msg => msg.sender === 'user').length,
      ai: chatHistory.filter(msg => msg.sender === 'ai').length
    };
  }, [chatHistory]);

  const getDatabaseStats = useCallback(() => {
    try {
      return chatDatabase.getStats();
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        totalSessions: 0,
        totalMessages: 0,
        currentSessionMessages: 0,
        databaseSize: '0 KB'
      };
    }
  }, []);

  const getAllSessions = useCallback(() => {
    try {
      return chatDatabase.getAllSessions();
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return [];
    }
  }, []);

  const switchToSession = useCallback(async (sessionId: string) => {
    try {
      const messages = chatDatabase.getSessionMessages(sessionId);
      setChatHistory(messages);
      setConversationId(sessionId);
    } catch (error) {
      console.error('Error switching to session:', error);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      chatDatabase.deleteSession(sessionId);
      if (conversationId === sessionId) {
        await clearHistory();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }, [conversationId, clearHistory]);

  const clearAllData = useCallback(async (keepContext: boolean = false) => {
    try {
      if (keepContext) {
        // Clear with persistent context
        chatDatabase.clearAllDataWithOptions({ keepPersistentContext: true });
        
        // Start new session with context
        const newSessionId = chatDatabase.startNewSession();
        setConversationId(newSessionId);
        
        const persistentContext = chatDatabase.getContextForNewSession();
        if (persistentContext) {
          const contextMessage: Message = {
            id: `ctx_${Date.now()}`,
            text: "New session started. I have your previous context and farming preferences.",
            sender: 'system',
            timestamp: Date.now()
          };
          setChatHistory([contextMessage]);
        } else {
          setChatHistory([]);
        }
      } else {
        // Complete clear - no context preservation
        chatDatabase.clearAllDataWithOptions({ 
          keepPersistentContext: false, 
          keepUserPreferences: false 
        });
        setChatHistory([]);
        setConversationId(null);
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }, []);

  return {
    chatHistory,
    conversationId,
    isLoading,
    addMessage,
    addConversationTurn,
    clearHistory,
    getContextForAI,
    getLastUserMessage,
    getMessageCount,
    getDatabaseStats,
    getAllSessions,
    switchToSession,
    deleteSession,
    clearAllData
  };
};

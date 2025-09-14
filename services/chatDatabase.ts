/**
 * Offline Chat Database with Compression
 * Stores chat history in compressed JSON format with context management
 */

import { Message } from '../types';

export interface CompressedChatData {
  id: string;
  timestamp: number;
  userMessage: string;
  aiResponse: string;
  imageData?: string;
  metadata?: {
    tokens?: number;
    responseTime?: number;
    model?: string;
  };
}

export interface ChatSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  messageCount: number;
  compressed: boolean;
  data: CompressedChatData[];
}

export interface DatabaseSchema {
  version: string;
  sessions: { [sessionId: string]: ChatSession };
  currentSession: string | null;
  settings: {
    maxSessions: number;
    compressionEnabled: boolean;
    maxContextMessages: number;
    autoCleanupDays: number;
  };
}

class OfflineChatDatabase {
  private readonly DB_KEY = 'smartagri-chat-database';
  private readonly VERSION = '1.0.0';
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
    this.performMaintenance();
  }

  /**
   * Load database from localStorage or create new one
   */
  private loadDatabase(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(this.DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DatabaseSchema;
        // Migrate if version mismatch
        if (parsed.version !== this.VERSION) {
          return this.migrateDatabase(parsed);
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading chat database:', error);
    }

    // Create new database
    return this.createNewDatabase();
  }

  /**
   * Create a fresh database structure
   */
  private createNewDatabase(): DatabaseSchema {
    return {
      version: this.VERSION,
      sessions: {},
      currentSession: null,
      settings: {
        maxSessions: 50,
        compressionEnabled: true,
        maxContextMessages: 20,
        autoCleanupDays: 30
      }
    };
  }

  /**
   * Migrate database from older versions
   */
  private migrateDatabase(oldDb: any): DatabaseSchema {
    // For now, create fresh database
    // In future, implement migration logic
    console.log('Migrating database to version', this.VERSION);
    return this.createNewDatabase();
  }

  /**
   * Save database to localStorage
   */
  private saveDatabase(): void {
    try {
      localStorage.setItem(this.DB_KEY, JSON.stringify(this.db));
    } catch (error) {
      console.error('Error saving chat database:', error);
      // Handle storage quota exceeded
      this.cleanup();
      try {
        localStorage.setItem(this.DB_KEY, JSON.stringify(this.db));
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
      }
    }
  }

  /**
   * Compress text using simple compression (can be enhanced with actual compression library)
   */
  private compressText(text: string): string {
    if (!this.db.settings.compressionEnabled) return text;
    
    // Simple compression: remove extra whitespace and common words substitution
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Decompress text (reverse of compression)
   */
  private decompressText(compressed: string): string {
    // For simple compression, return as-is
    // In real implementation, reverse the compression
    return compressed;
  }

  /**
   * Start a new chat session
   */
  public startNewSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    this.db.sessions[sessionId] = {
      sessionId,
      startTime: now,
      lastActivity: now,
      messageCount: 0,
      compressed: false,
      data: []
    };

    this.db.currentSession = sessionId;
    this.saveDatabase();
    return sessionId;
  }

  /**
   * Get current session ID or create new one
   */
  public getCurrentSession(): string {
    if (!this.db.currentSession || !this.db.sessions[this.db.currentSession]) {
      return this.startNewSession();
    }
    return this.db.currentSession;
  }

  /**
   * Add a complete conversation turn (user message + AI response)
   */
  public addConversationTurn(
    userMessage: string,
    aiResponse: string,
    imageData?: string,
    metadata?: CompressedChatData['metadata']
  ): string {
    const sessionId = this.getCurrentSession();
    const session = this.db.sessions[sessionId];

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const compressedData: CompressedChatData = {
      id: conversationId,
      timestamp: Date.now(),
      userMessage: this.compressText(userMessage),
      aiResponse: this.compressText(aiResponse),
      imageData: imageData,
      metadata: metadata
    };

    session.data.push(compressedData);
    session.messageCount += 2; // User + AI message
    session.lastActivity = Date.now();

    this.saveDatabase();
    return conversationId;
  }

  /**
   * Get conversation context for AI (decompressed recent messages)
   */
  public getContextForAI(sessionId?: string): Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }> {
    const targetSessionId = sessionId || this.getCurrentSession();
    const session = this.db.sessions[targetSessionId];
    
    if (!session) return [];

    const maxMessages = this.db.settings.maxContextMessages;
    const recentData = session.data.slice(-Math.floor(maxMessages / 2)); // Get recent conversation turns

    const context: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }> = [];

    recentData.forEach(data => {
      // Add user message
      context.push({
        role: 'user',
        content: this.decompressText(data.userMessage),
        timestamp: new Date(data.timestamp).toISOString()
      });

      // Add AI response
      context.push({
        role: 'assistant',
        content: this.decompressText(data.aiResponse),
        timestamp: new Date(data.timestamp).toISOString()
      });
    });

    return context;
  }

  /**
   * Get all messages for display (converted to Message format)
   */
  public getSessionMessages(sessionId?: string): Message[] {
    const targetSessionId = sessionId || this.getCurrentSession();
    const session = this.db.sessions[targetSessionId];
    
    if (!session) return [];

    const messages: Message[] = [];

    session.data.forEach(data => {
      // User message
      messages.push({
        id: `${data.id}_user`,
        text: this.decompressText(data.userMessage),
        sender: 'user',
        timestamp: data.timestamp,
        ...(data.imageData && { image: data.imageData })
      });

      // AI response
      messages.push({
        id: `${data.id}_ai`,
        text: this.decompressText(data.aiResponse),
        sender: 'ai',
        timestamp: data.timestamp + 1 // Slightly later timestamp
      });
    });

    return messages;
  }

  /**
   * Get all sessions
   */
  public getAllSessions(): ChatSession[] {
    return Object.values(this.db.sessions).sort((a, b) => b.lastActivity - a.lastActivity);
  }

  /**
   * Delete a session
   */
  public deleteSession(sessionId: string): void {
    delete this.db.sessions[sessionId];
    if (this.db.currentSession === sessionId) {
      this.db.currentSession = null;
    }
    this.saveDatabase();
  }

  /**
   * Clear all chat data
   */
  public clearAllData(): void {
    this.db.sessions = {};
    this.db.currentSession = null;
    this.saveDatabase();
  }

  /**
   * Get database statistics
   */
  public getStats(): {
    totalSessions: number;
    totalMessages: number;
    currentSessionMessages: number;
    databaseSize: string;
  } {
    const sessions = Object.values(this.db.sessions);
    const totalMessages = sessions.reduce((sum, session) => sum + session.messageCount, 0);
    const currentSession = this.db.currentSession ? this.db.sessions[this.db.currentSession] : null;
    
    const dbString = JSON.stringify(this.db);
    const sizeInBytes = new Blob([dbString]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);

    return {
      totalSessions: sessions.length,
      totalMessages,
      currentSessionMessages: currentSession ? currentSession.messageCount : 0,
      databaseSize: `${sizeInKB} KB`
    };
  }

  /**
   * Perform maintenance tasks
   */
  private performMaintenance(): void {
    const now = Date.now();
    const cutoffTime = now - (this.db.settings.autoCleanupDays * 24 * 60 * 60 * 1000);

    // Remove old sessions
    Object.values(this.db.sessions).forEach(session => {
      if (session.lastActivity < cutoffTime) {
        delete this.db.sessions[session.sessionId];
      }
    });

    // Limit number of sessions
    const sessions = Object.values(this.db.sessions).sort((a, b) => b.lastActivity - a.lastActivity);
    if (sessions.length > this.db.settings.maxSessions) {
      const sessionsToRemove = sessions.slice(this.db.settings.maxSessions);
      sessionsToRemove.forEach(session => {
        delete this.db.sessions[session.sessionId];
      });
    }

    this.saveDatabase();
  }

  /**
   * Manual cleanup to free space
   */
  private cleanup(): void {
    // Remove oldest sessions first
    const sessions = Object.values(this.db.sessions).sort((a, b) => a.lastActivity - b.lastActivity);
    const sessionsToRemove = sessions.slice(0, Math.floor(sessions.length / 2));
    
    sessionsToRemove.forEach(session => {
      delete this.db.sessions[session.sessionId];
    });
  }

  /**
   * Save persistent context that survives session deletion
   */
  public savePersistentContext(sessionId?: string): void {
    try {
      const targetSessionId = sessionId || this.getCurrentSession();
      const session = this.db.sessions[targetSessionId];
      
      if (!session || session.data.length === 0) return;

      const contextSummary = this.generateContextSummary(session);
      const compressed = this.compressText(JSON.stringify(contextSummary));
      
      localStorage.setItem('smartagri-persistent-context', compressed);
      console.log('💾 Persistent context saved');
    } catch (error) {
      console.error('Error saving persistent context:', error);
    }
  }

  /**
   * Get persistent context from storage
   */
  public getPersistentContext(): any {
    try {
      const compressed = localStorage.getItem('smartagri-persistent-context');
      if (!compressed) return null;
      
      const decompressed = this.decompressText(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Error loading persistent context:', error);
      return null;
    }
  }

  /**
   * Generate context summary for persistence
   */
  private generateContextSummary(session: ChatSession): any {
    const topics = new Set<string>();
    const userPreferences: any = {};
    const recentConversations = session.data.slice(-3); // Last 3 conversation turns
    
    session.data.forEach(data => {
      const userContent = data.userMessage.toLowerCase();
      const aiContent = data.aiResponse.toLowerCase();
      
      // Extract topics from conversations
      if (userContent.includes('crop') || aiContent.includes('crop')) topics.add('crops');
      if (userContent.includes('disease') || aiContent.includes('disease')) topics.add('diseases');
      if (userContent.includes('weather') || aiContent.includes('weather')) topics.add('weather');
      if (userContent.includes('pest') || aiContent.includes('pest')) topics.add('pests');
      if (userContent.includes('fertilizer') || aiContent.includes('fertilizer')) topics.add('fertilizers');
      if (userContent.includes('soil') || aiContent.includes('soil')) topics.add('soil');
      if (userContent.includes('irrigation') || aiContent.includes('irrigation')) topics.add('irrigation');
      if (userContent.includes('harvest') || aiContent.includes('harvest')) topics.add('harvest');
      if (userContent.includes('seed') || aiContent.includes('seed')) topics.add('seeds');
      if (userContent.includes('price') || aiContent.includes('price')) topics.add('market-prices');
    });

    return {
      topics: Array.from(topics),
      recentConversations: recentConversations.map(data => ({
        userQuery: data.userMessage.substring(0, 100), // First 100 chars
        aiSummary: data.aiResponse.substring(0, 150), // First 150 chars
        timestamp: data.timestamp
      })),
      totalConversations: session.data.length,
      lastActiveDate: session.lastActivity,
      sessionDuration: session.lastActivity - session.startTime,
      version: '1.0'
    };
  }

  /**
   * Get context prompt for new sessions
   */
  public getContextForNewSession(): string {
    try {
      const persistentContext = this.getPersistentContext();
      if (!persistentContext || persistentContext.topics.length === 0) return '';

      const topicsText = persistentContext.topics.join(', ');
      const recentSummary = persistentContext.recentConversations
        .map((conv: any) => `User asked about: ${conv.userQuery}`)
        .join('; ');

      return `Previous session context: User has shown interest in ${topicsText}. Recent topics: ${recentSummary}. Total previous conversations: ${persistentContext.totalConversations}. Please use this context to provide more personalized farming advice.`;
    } catch (error) {
      console.error('Error getting context for new session:', error);
      return '';
    }
  }

  /**
   * Enhanced clear with persistent context option
   */
  public clearAllDataWithOptions(options: {
    keepPersistentContext?: boolean;
    keepUserPreferences?: boolean;
  } = {}): void {
    try {
      if (options.keepPersistentContext) {
        // Save context from current session before clearing
        this.savePersistentContext();
      }

      if (options.keepUserPreferences) {
        const userPrefs = localStorage.getItem('smartagri-user-preferences');
        this.db.sessions = {};
        this.db.currentSession = null;
        this.saveDatabase();
        
        if (userPrefs) {
          localStorage.setItem('smartagri-user-preferences', userPrefs);
        }
      } else {
        // Complete clear
        this.db.sessions = {};
        this.db.currentSession = null;
        this.saveDatabase();
        
        if (!options.keepPersistentContext) {
          localStorage.removeItem('smartagri-persistent-context');
        }
        localStorage.removeItem('smartagri-user-preferences');
      }
      
      console.log('🗑️ Database cleared with options:', options);
    } catch (error) {
      console.error('Error clearing database with options:', error);
    }
  }

  /**
   * Export database for backup
   */
  public exportDatabase(): string {
    return JSON.stringify(this.db, null, 2);
  }

  /**
   * Import database from backup
   */
  public importDatabase(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as DatabaseSchema;
      this.db = imported;
      this.saveDatabase();
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }
}

// Create singleton instance
export const chatDatabase = new OfflineChatDatabase();
export default chatDatabase;

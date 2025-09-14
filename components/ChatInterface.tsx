
import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import { useAppContext } from '../context/AppContext';
import { useChatContext } from '../hooks/useChatContext';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onQuickAction?: (action: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onQuickAction }) => {
    const { getText } = useAppContext();
    const { clearHistory, getMessageCount, getDatabaseStats, clearAllData } = useChatContext();
    const [showClearOptions, setShowClearOptions] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const messageCount = getMessageCount();
    const dbStats = getDatabaseStats();
    
    // Use only the messages passed as props (which is now chatHistory from App.tsx)
    const allMessages = React.useMemo(() => {
        // Sort by timestamp to ensure proper order
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    }, [messages]);

    const handleClear = async (keepContext: boolean) => {
        if (keepContext) {
            await clearHistory(); // This now saves context automatically
        } else {
            await clearAllData(false); // Complete reset
        }
        setShowClearOptions(false);
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-transparent to-gray-50/50 relative">
            {/* Background pattern */}
            <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(1px)'
                }}
            ></div>
            
            {/* Chat header with stats and clear button */}
            {allMessages.length > 0 && (
                <div className="relative z-10 flex justify-between items-center mb-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                            💬 {messageCount.total} messages
                        </span>
                        <span className="text-xs text-gray-500">
                            ({messageCount.user} you, {messageCount.ai} assistant)
                        </span>
                        <span className="text-xs text-blue-500">
                            📦 {dbStats.databaseSize}
                        </span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowClearOptions(!showClearOptions)}
                            className="text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                            title="Clear options"
                        >
                            🗑️ Clear ▼
                        </button>
                        
                        {showClearOptions && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-48 z-350">
                                <button
                                    onClick={() => handleClear(true)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded flex items-center gap-2"
                                >
                                    🔄 New Session (Keep Context)
                                    <span className="text-xs text-gray-500">Recommended</span>
                                </button>
                                <button
                                    onClick={() => handleClear(false)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded flex items-center gap-2 text-red-600"
                                >
                                    � Complete Reset
                                    <span className="text-xs text-gray-500">Lose all data</span>
                                </button>
                                <button
                                    onClick={() => setShowClearOptions(false)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded text-gray-500"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Chat content */}
            <div className="relative flex flex-col gap-4 min-h-full">
                {allMessages.length === 0 && (
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-center animate-fade-in mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center shadow-soft-lg">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to SmartAgri!</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
                                I'm here to help you with farming advice, crop diagnosis, and agricultural guidance. Choose a quick action below or ask me anything!
                            </p>
                            <div className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2 mb-4">
                                💾 Your conversations persist across sessions with smart context retention
                            </div>
                        </div>
                        {onQuickAction && (
                            <div className="animate-slide-up">
                                <QuickActions onActionSelect={onQuickAction} />
                            </div>
                        )}
                    </div>
                )}
                
                {allMessages.map((msg, index) => (
                    <div key={msg.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <MessageBubble message={msg} />
                    </div>
                ))}
                
                {/* Enhanced loading indicator */}
                {isLoading && (
                    <div className="flex justify-start animate-bounce-in">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-white/50 max-w-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">SmartAgri is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

export default ChatInterface;

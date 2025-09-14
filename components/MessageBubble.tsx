
import React, { useEffect } from 'react';
import type { Message } from '../types';
import InfoCard from './InfoCard';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface MessageBubbleProps {
    message: Message;
}

const ReplayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-800">
        <path d="M17 2.1a9 9 0 0 0-14.1 0" /><path d="M17 2.1a9 9 0 0 1 0 14.1" />
        <path d="M12 18a9 9 0 0 0 7.4-4.9" /><path d="M12 18a9 9 0 0 1-7.4-4.9" />
        <path d="M2 10.9v3.4" /><path d="M22 10.9v3.4" />
        <circle cx="12" cy="12" r="10" /><path d="m9 12 6-3.5v7L9 12z" />
    </svg>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    const { speak } = useTextToSpeech();

    const textToSpeak = message.cardData
        ? `${message.cardData.title}. ${Array.isArray(message.cardData.content) ? message.cardData.content.join('. ') : message.cardData.content}`
        : '';

    useEffect(() => {
        if (message.sender === 'ai' && message.cardData) {
            speak(textToSpeak);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message.id, speak]);


    const renderContent = () => {
        if (message.cardData) {
            return (
                <div className="relative">
                    <InfoCard data={message.cardData} />
                    <button 
                        onClick={() => speak(textToSpeak)} 
                        className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-full backdrop-blur-sm shadow-soft hover:bg-white hover:shadow-md transition-all duration-200 focus-ring" 
                        aria-label="Replay audio"
                    >
                        <ReplayIcon />
                    </button>
                </div>
            );
        }
        if (message.imageUrl) {
            return (
                <div className="p-0 overflow-hidden">
                    <img 
                        src={message.imageUrl} 
                        alt="User upload" 
                        className="rounded-t-2xl w-full max-h-64 object-cover" 
                    />
                    {message.text && (
                        <div className="p-4">
                            <p className="text-gray-800">{message.text}</p>
                        </div>
                    )}
                </div>
            );
        }
        if (message.sender === 'system') {
            return (
                 <div className="w-full flex justify-center my-2">
                    <div className="text-xs text-center text-gray-500 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-white/50">
                        {message.text}
                    </div>
                 </div>
            );
        }
        return <p className="text-gray-800 leading-relaxed">{message.text}</p>;
    };

    if (message.sender === 'system') {
        return <div className="animate-fade-in">{renderContent()}</div>;
    }
    
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`
                rounded-2xl shadow-soft max-w-[85%] sm:max-w-sm relative
                ${isUser 
                    ? 'bg-gradient-to-br from-chat-user to-green-100 text-gray-800 rounded-br-md' 
                    : 'bg-white/95 backdrop-blur-sm text-gray-800 border border-white/50 rounded-bl-md'
                }
                ${message.imageUrl ? '' : 'p-4'}
                ${!isUser ? 'shadow-soft-lg' : ''}
            `}>
                {/* Message timestamp */}
                {!message.cardData && (
                    <div className={`text-xs text-gray-500 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
                
                {renderContent()}
                
                {/* Message status indicator for user messages */}
                {isUser && (
                    <div className="flex justify-end mt-1">
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>✓</span>
                            <span>Sent</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;

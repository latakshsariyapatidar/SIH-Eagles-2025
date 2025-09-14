
import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M22 2 11 13"></path>
        <path d="m22 2-7 20-4-9-9-4 20-7z"></path>
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);


interface ChatInputProps {
    onSend: (text: string, image: { data: string; mimeType: string } | null) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const { getText } = useAppContext();
    const [text, setText] = useState('');
    const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setImage({
                    data: result.split(',')[1],
                    mimeType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = () => {
        if (!isLoading && (text || image)) {
            onSend(text, image);
            setText('');
            setImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <div className="p-4 bg-white/95 backdrop-blur-md border-t border-gray-200/50 relative z-10">
            {/* Image preview section */}
            {imagePreview && (
                <div className="mb-3 animate-slide-up">
                    <div className="relative inline-block">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-20 h-20 rounded-xl object-cover shadow-soft border-2 border-white" 
                        />
                        <button
                            onClick={() => { 
                                setImage(null); 
                                setImagePreview(null); 
                                if (fileInputRef.current) fileInputRef.current.value = ''; 
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-all duration-200 focus-ring"
                            aria-label="Remove image"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
            
            {/* Camera and Mic buttons above input - positioned at corners */}
            <div className="flex justify-between items-center mb-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                />
                
                {/* Camera button - left corner */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-gray-100 rounded-xl shadow-soft hover:bg-gray-200 hover:shadow-md transition-all duration-200 touch-target focus-ring"
                    aria-label="Upload image"
                    disabled={isLoading}
                >
                    <CameraIcon />
                </button>

                {/* Microphone button - right corner */}
                <button 
                    onClick={() => {/* No logic implemented yet */}}
                    className="p-3 bg-gray-100 rounded-xl shadow-soft hover:bg-gray-200 hover:shadow-md transition-all duration-200 touch-target focus-ring"
                    aria-label="Voice input"
                    disabled={isLoading}
                >
                    <MicrophoneIcon />
                </button>
            </div>
            
            {/* Input section - full width */}
            <div className="flex items-end gap-3">                
                {/* Text input container - full width */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message or upload an image..."
                        className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft text-base resize-none disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isLoading}
                    />
                    
                    {/* Character count indicator for long messages */}
                    {text.length > 100 && (
                        <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white px-1 rounded">
                            {text.length}
                        </div>
                    )}
                </div>
                
                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={isLoading || (!text.trim() && !image)}
                    className={`p-4 rounded-xl shadow-soft touch-target focus-ring transition-all duration-300 ${
                        isLoading || (!text.trim() && !image)
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-secondary-400 to-primary-500 hover:from-secondary-500 hover:to-primary-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <LoadingSpinner size="md" color="white" />
                    ) : (
                        <SendIcon />
                    )}
                </button>
            </div>
            
            {/* Help text */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span>Tip: Upload a crop image for better diagnosis</span>
                </div>
                {text.length > 0 && (
                    <button 
                        onClick={() => setText('')}
                        className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatInput;

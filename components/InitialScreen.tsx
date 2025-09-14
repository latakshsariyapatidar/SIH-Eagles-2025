import React from 'react';

interface InitialScreenProps {
  isVisible: boolean;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-8 animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-soft">
          <div className="text-5xl">🌱</div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Welcome to SmartAgri
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your AI-powered farming assistant. Upload a photo of your crop or ask any farming question to get started.
        </p>
        
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <span>📷</span>
            <span>Upload crop images for diagnosis</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>🎯</span>
            <span>Get personalized farming advice</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>🌦️</span>
            <span>Weather-based recommendations</span>
          </div>
        </div>
        
        <div className="mt-8 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
import React from 'react';
import { useAppContext } from '../context/AppContext';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionSelect }) => {
  const { getText } = useAppContext();

  const quickActions = [
    {
      id: 'crop-disease',
      icon: '🦠',
      title: 'Crop Disease Diagnosis',
      description: 'Identify diseases in your crops',
      action: 'Help me identify diseases in my crops'
    },
    {
      id: 'weather-advice',
      icon: '🌤️',
      title: 'Weather Guidance',
      description: 'Get weather-based farming advice',
      action: 'Give me farming advice based on current weather'
    },
    {
      id: 'pest-control',
      icon: '🐛',
      title: 'Pest Management',
      description: 'Learn about pest control methods',
      action: 'How can I manage pests in my farm?'
    },
    {
      id: 'fertilizer',
      icon: '🌱',
      title: 'Fertilizer Advice',
      description: 'Get fertilizer recommendations',
      action: 'What fertilizer should I use for my crops?'
    },
    {
      id: 'irrigation',
      icon: '💧',
      title: 'Irrigation Tips',
      description: 'Optimize your watering schedule',
      action: 'Help me optimize irrigation for my crops'
    },
    {
      id: 'market-prices',
      icon: '💰',
      title: 'Market Prices',
      description: 'Get current market information',
      action: 'What are the current market prices for crops?'
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        How can I help you today?
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionSelect(action.action)}
            className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-white hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div className="text-center">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </div>
              <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-primary-600 transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-gray-600 leading-tight">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-2">💡 Pro Tip</p>
        <p className="text-sm text-gray-600">
          Upload a photo of your crops for more accurate diagnosis and advice!
        </p>
      </div>
    </div>
  );
};

export default QuickActions;

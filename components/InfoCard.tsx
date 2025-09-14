import React from 'react';
import type { CardData } from '../types';
import { URGENCY_COLORS } from '../constants';

interface InfoCardProps {
    data: CardData;
}

const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
    const borderColorClass = URGENCY_COLORS[data.urgency] || 'border-gray-300';
    
    // Enhanced urgency styling
    const urgencyStyles = {
        CRITICAL: 'border-red-500 bg-red-50/80 shadow-red-100',
        MEDIUM: 'border-orange-400 bg-orange-50/80 shadow-orange-100',
        NORMAL: 'border-green-500 bg-green-50/80 shadow-green-100'
    };
    
    const currentStyle = urgencyStyles[data.urgency] || urgencyStyles.NORMAL;
    
    // Get icon based on card type
    const getCardIcon = () => {
        switch (data.type) {
            case 'CURE': return '💊';
            case 'PRICE': return '💰';
            case 'ALERT': return '⚠️';
            case 'WEATHER': return '🌤️';
            case 'TIP': return '💡';
            default: return '📋';
        }
    };

    return (
        <div className={`border-l-4 ${currentStyle} p-5 rounded-xl bg-white/95 backdrop-blur-sm w-full shadow-soft hover:shadow-md transition-all duration-300`}>
            {/* Card header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl mt-1">
                    {getCardIcon()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-800 leading-tight">{data.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            data.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            data.urgency === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {data.urgency.toLowerCase()}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        {data.type.replace('_', ' ')}
                    </div>
                </div>
            </div>
            
            {/* Card content */}
            <div className="mb-4">
                {Array.isArray(data.content) ? (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        {data.content.map((item, index) => (
                            <li key={index} className="leading-relaxed pl-2">
                                <span className="ml-2">{item}</span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-gray-700 leading-relaxed">{data.content}</p>
                )}
            </div>
            
            {/* Card footer */}
            {data.source && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📚</span>
                        <span>Source: {data.source}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoCard;

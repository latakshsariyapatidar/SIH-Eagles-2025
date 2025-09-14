
import { Urgency, Language } from './types';

export const URGENCY_COLORS: { [key in Urgency]: string } = {
  [Urgency.CRITICAL]: 'border-red-500',
  [Urgency.MEDIUM]: 'border-orange-400',
  [Urgency.NORMAL]: 'border-green-500',
};

export const UI_TEXT: { [key in Language]: { [key: string]: string } } = {
  [Language.EN]: {
    placeholder: 'Type a message or upload an image...',
    send: 'Send',
    loading: 'SmartAgri is thinking...',
    weatherTitle: 'Today\'s Weather',
    temp: 'Temp',
    rain: 'Rain',
    onboardingTitle: 'Welcome to SmartAgri!',
    onboardingLang: 'Please select your language:',
    onboardingStart: 'Start Farming Smarter',
  },
  [Language.HI]: {
    placeholder: 'संदेश टाइप करें या छवि अपलोड करें...',
    send: 'भेजें',
    loading: 'स्मार्टएग्री सोच रहा है...',
    weatherTitle: 'आज का मौसम',
    temp: 'तापमान',
    rain: 'बारिश',
    onboardingTitle: 'स्मार्टएग्री में आपका स्वागत है!',
    onboardingLang: 'कृपया अपनी भाषा चुनें:',
    onboardingStart: 'स्मार्ट खेती शुरू करें',
  },
  [Language.PA]: {
    placeholder: 'ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ ਜਾਂ ਚਿੱਤਰ ਅੱਪਲੋਡ ਕਰੋ...',
    send: 'ਭੇਜੋ',
    loading: 'ਸਮਾਰਟਐਗਰੀ ਸੋਚ ਰਿਹਾ ਹੈ...',
    weatherTitle: 'ਅੱਜ ਦਾ ਮੌਸਮ',
    temp: 'ਤਾਪਮਾਨ',
    rain: 'ਮੀਂਹ',
    onboardingTitle: 'ਸਮਾਰਟਐਗਰੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!',
    onboardingLang: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ:',
    onboardingStart: 'ਚੁਸਤ ਖੇਤੀ ਸ਼ੁਰੂ ਕਰੋ',
  },
};

export const LANGUAGE_MAP: { [key in Language]: string } = {
  [Language.EN]: 'en-US',
  [Language.HI]: 'hi-IN',
  [Language.PA]: 'pa-IN',
}

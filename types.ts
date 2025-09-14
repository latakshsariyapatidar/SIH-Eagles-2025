
export enum Language {
  EN = 'English',
  HI = 'Hindi',
  PA = 'Punjabi',
}

export enum Urgency {
  CRITICAL = 'CRITICAL',
  MEDIUM = 'MEDIUM',
  NORMAL = 'NORMAL',
}

export enum CardType {
  CURE = 'CURE',
  PRICE = 'PRICE',
  ALERT = 'ALERT',
  WEATHER = 'WEATHER',
  TIP = 'TIP',
}

export interface CardData {
  type: CardType;
  urgency: Urgency;
  title: string;
  content: string[] | string;
  source?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text?: string;
  imageUrl?: string; 
  cardData?: CardData;
  timestamp: number;
}

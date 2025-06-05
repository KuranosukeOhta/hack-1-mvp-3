export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
}

export interface DiaryResult {
  id: string;
  sessionId: string;
  date: Date;
  summary: string;
  emotionScore: number; // 1-10
  keywords: string[];
  highlights: string[];
  growthPoints: string[];
  reflectionText: string;
}

export interface ChatState {
  currentSession: ChatSession | null;
  isActive: boolean;
  timeRemaining: number; // seconds
  hasTimeExpired: boolean;
}

export interface ResultScreenData {
  diaryEntry: string;
  emotionScore: number;
  keywords: string[];
  highlights: string[];
  growthPoints: string[];
  sessionDuration: number; // minutes
}

export interface SavedDiary {
  id: string;
  date: string; // YYYY-MM-DD format
  timestamp: number; // Unix timestamp
  diaryEntry: string;
  emotionScore: number;
  keywords: string[];
  highlights: string[];
  growthPoints: string[];
  sessionDuration: number;
}

export interface DiaryStorage {
  diaries: SavedDiary[];
} 
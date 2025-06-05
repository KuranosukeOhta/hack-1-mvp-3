import { SavedDiary, DiaryStorage, ResultScreenData } from '@/types';

const STORAGE_KEY = 'diary-app-storage';

export function getDiaryStorage(): DiaryStorage {
  if (typeof window === 'undefined') {
    return { diaries: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data;
    }
  } catch (error) {
    console.error('Failed to load diary storage:', error);
  }
  
  return { diaries: [] };
}

export function saveDiaryStorage(storage: DiaryStorage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save diary storage:', error);
  }
}

export function saveDiary(resultData: ResultScreenData): SavedDiary {
  const storage = getDiaryStorage();
  const now = new Date();
  const dateString = now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');

  const savedDiary: SavedDiary = {
    id: `diary-${now.getTime()}`,
    date: dateString,
    timestamp: now.getTime(),
    diaryEntry: resultData.diaryEntry,
    emotionScore: resultData.emotionScore,
    keywords: resultData.keywords,
    highlights: resultData.highlights,
    growthPoints: resultData.growthPoints,
    sessionDuration: resultData.sessionDuration,
    createdAt: now.toISOString(),
  };

  storage.diaries.unshift(savedDiary); // 新しい日記を先頭に追加
  saveDiaryStorage(storage);
  
  return savedDiary;
}

export function getAllDiaries(): SavedDiary[] {
  const storage = getDiaryStorage();
  return storage.diaries.sort((a, b) => b.timestamp - a.timestamp); // 新しい順
}

export function getDiary(id: string): SavedDiary | null {
  const storage = getDiaryStorage();
  return storage.diaries.find(diary => diary.id === id) || null;
}

export function deleteDiary(id: string): boolean {
  const storage = getDiaryStorage();
  const index = storage.diaries.findIndex(diary => diary.id === id);
  
  if (index === -1) return false;
  
  storage.diaries.splice(index, 1);
  saveDiaryStorage(storage);
  return true;
}

export function getDiariesSummary(): string {
  const diaries = getAllDiaries();
  if (diaries.length === 0) {
    return '過去の日記はまだありません。';
  }

  const recentDiaries = diaries.slice(0, 5); // 最新5件
  const summaryLines = recentDiaries.map(diary => {
    const keywords = diary.keywords.slice(0, 3).join(', ');
    return `${diary.date}: 気分${diary.emotionScore}/10, キーワード: ${keywords}`;
  });

  return `過去の日記（最新5件）:\n${summaryLines.join('\n')}`;
} 
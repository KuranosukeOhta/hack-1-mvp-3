'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Calendar, 
  Heart, 
  Tag, 
  Trash2, 
  ArrowRight, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedDiary } from '@/types';
import { getAllDiaries, deleteDiary } from '@/lib/diary-storage';
import { getAuthState, isOnboardingComplete } from '@/lib/profile-storage';

export default function HomePage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<SavedDiary[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadDiaries = () => {
      const authState = getAuthState();
      
      // 認証されていない、またはオンボーディングが完了していない場合
      if (!authState.isAuthenticated || !isOnboardingComplete()) {
        router.push('/welcome');
        return;
      }

      // 認証済みユーザーの日記を読み込み
      const loadDiaries = () => {
        const allDiaries = getAllDiaries();
        setDiaries(allDiaries);
        
        // 初回ユーザーの場合はウェルカム画面を表示
        if (allDiaries.length === 0) {
          setShowWelcome(true);
        }
      };

      loadDiaries();
      setIsLoading(false);
    };

    checkAuthAndLoadDiaries();
  }, [router]);

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-warm-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const handleDeleteDiary = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm('この日記を削除しますか？')) {
      if (deleteDiary(id)) {
        setDiaries(prev => prev.filter(diary => diary.id !== id));
      }
    }
  };

  const getEmotionEmoji = (score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '😐';
    if (score >= 4) return '😔';
    return '😢';
  };

  const getEmotionColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (showWelcome) {
    return (
      <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl font-bold text-navy-dark mb-4">
            今日の振り返りへ<br />ようこそ！
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            AIと一緒に今日1日を振り返って、自動で日記を作成するアプリです。<br />
            2分間の会話で素敵な振り返りをしませんか？
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/chat')}
              className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-3 text-lg font-semibold rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              初めての振り返りを始める
            </Button>
            
            <Button
              onClick={() => setShowWelcome(false)}
              variant="outline"
              className="w-full"
            >
              アプリについて詳しく見る
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col">
      {/* Fixed Header */}
      <div className="h-[90px] flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-orange-100 p-4 relative z-40">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-xl font-bold text-navy-dark flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-warm-orange" />
                今日の振り返り
              </h1>
              <p className="text-sm text-gray-600">
                {diaries.length > 0 ? `${diaries.length}件の日記` : '記録を始めましょう'}
              </p>
            </div>
            
            <Button
              onClick={() => router.push('/chat')}
              className="bg-warm-orange hover:bg-warm-orange/90 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-1" />
              新しい振り返り
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 h-[calc(100dvh-90px)] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4 max-w-md mx-auto">
            {diaries.length === 0 ? (
              // 空の状態
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">📖</div>
                <h2 className="text-xl font-semibold text-navy-dark mb-3">
                  まだ日記がありません
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  AIと2分間話すだけで<br />
                  素敵な日記が自動で作られます
                </p>
                
                <Button
                  onClick={() => router.push('/chat')}
                  className="bg-warm-orange hover:bg-warm-orange/90 text-white py-3 px-8 text-lg font-semibold rounded-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  今日の振り返りを始める
                </Button>
              </motion.div>
            ) : (
              // 日記一覧
              <AnimatePresence>
                {diaries.map((diary, index) => (
                  <motion.div
                    key={diary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-4 bg-white/90 border-orange-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div 
                        onClick={() => router.push(`/diary/${diary.id}`)}
                        className="space-y-3"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getEmotionEmoji(diary.emotionScore)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-navy-dark">
                                  {diary.date}
                                </span>
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(diary.emotionScore)}`}>
                                <Heart className="w-3 h-3 mr-1" />
                                {diary.emotionScore}/10
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={(e) => handleDeleteDiary(diary.id, e)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-500 p-1 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-orange-600" />
                          <div className="flex flex-wrap gap-1">
                            {diary.keywords.slice(0, 3).map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-orange-100 text-orange-700 text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                            {diary.keywords.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{diary.keywords.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Preview */}
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {diary.diaryEntry.length > 100 
                            ? `${diary.diaryEntry.substring(0, 100)}...`
                            : diary.diaryEntry
                          }
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 
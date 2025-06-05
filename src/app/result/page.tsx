'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Star, Heart, Clock, Tag, Lightbulb, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultScreenData } from '@/types';

export default function ResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<ResultScreenData | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem('diaryResult');
    if (data) {
      setResultData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (resultData && showAnimation) {
      const timer = setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
        } else {
          setShowAnimation(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [resultData, showAnimation, currentStep]);

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 bg-warm-orange rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  const getEmotionColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEmotionEmoji = (score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '😐';
    if (score >= 4) return '😔';
    return '😢';
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 mobile-safe-area">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-orange-100 p-4 z-40">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-navy-dark">今日の振り返り完了！</h1>
            </div>
            <p className="text-sm text-gray-600">
              {resultData.sessionDuration}分間の素敵な振り返りでした
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Area with proper spacing */}
      <div className="h-full pt-20 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6 max-w-md mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: currentStep >= 0 ? 1 : 0,
              scale: currentStep >= 0 ? 1 : 0.9 
            }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <div className="text-center space-y-4">
                <div className="text-6xl">
                  {getEmotionEmoji(resultData.emotionScore)}
                </div>
                <div>
                  <div className="text-3xl font-bold text-navy-dark mb-2">
                    {resultData.emotionScore}/10
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(resultData.emotionScore)}`}>
                    <Heart className="w-4 h-4 mr-1" />
                    今日の気分スコア
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>気分レベル</span>
                    <span>{resultData.emotionScore}/10</span>
                  </div>
                  <Progress value={resultData.emotionScore * 10} className="h-2" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Keywords */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: currentStep >= 1 ? 1 : 0,
              x: currentStep >= 1 ? 0 : -20 
            }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-white/90 border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-navy-dark">今日のキーワード</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resultData.keywords.map((keyword, index) => (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {keyword}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: currentStep >= 2 ? 1 : 0,
              x: currentStep >= 2 ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-white/90 border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-navy-dark">今日のハイライト</h3>
              </div>
              <div className="space-y-2">
                {resultData.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Growth Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep >= 3 ? 1 : 0,
              y: currentStep >= 3 ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-white/90 border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-navy-dark">成長ポイント</h3>
              </div>
              <div className="space-y-2">
                {resultData.growthPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{point}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Diary Entry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep >= 4 ? 1 : 0,
              y: currentStep >= 4 ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-navy-dark">今日の日記</h3>
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {resultData.diaryEntry}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: !showAnimation ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3 pb-6"
          >
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-3 text-lg font-semibold rounded-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              ホームに戻る
            </Button>
            
            <Button
              onClick={() => {
                // 日記データをクリップボードにコピー
                navigator.clipboard.writeText(resultData.diaryEntry);
              }}
              variant="outline"
              className="w-full"
            >
              日記をコピー
            </Button>
          </motion.div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Tag, 
  Lightbulb, 
  Star, 
  Clock, 
  Download,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SavedDiary } from '@/types';
import { getDiary } from '@/lib/diary-storage';
import html2canvas from 'html2canvas';

export default function DiaryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [diary, setDiary] = useState<SavedDiary | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      const diaryData = getDiary(params.id);
      setDiary(diaryData);
    }
  }, [params.id]);

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

  const handleSaveAsImage = async () => {
    if (!captureRef.current || !diary) return;
    
    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 400,
        height: 600,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `今日の振り返り_${diary.date}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('画像保存エラー:', error);
      alert('画像の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!diary) {
    return (
      <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 bg-warm-orange rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">日記を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex flex-col">
      {/* Fixed Header */}
      <div className="h-[90px] flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-orange-100 p-4 relative z-40">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="text-gray-600 p-2"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              戻る
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-navy-dark">日記詳細</h1>
              <p className="text-sm text-gray-600">{diary.date}</p>
            </div>
            
            <Button
              onClick={handleSaveAsImage}
              variant="ghost"
              size="sm"
              className="text-gray-600 p-2"
              disabled={isGeneratingImage}
            >
              <Download className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hidden element for image capture */}
      <div className="fixed -top-[9999px] left-0">
        <div 
          ref={captureRef}
          className="w-[400px] bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 p-6"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header for image */}
          <div className="text-center mb-6">
            <div className="text-2xl mb-2">✨</div>
            <h1 className="text-2xl font-bold text-navy-dark mb-1">今日の振り返り</h1>
            <p className="text-sm text-gray-600">{diary.date}</p>
          </div>

          {/* Score */}
          <div className="bg-white rounded-xl p-4 mb-4 text-center shadow-sm">
            <div className="text-4xl mb-2">{getEmotionEmoji(diary.emotionScore)}</div>
            <div className="text-2xl font-bold text-navy-dark mb-1">
              {diary.emotionScore}/10
            </div>
            <div className="text-sm text-gray-600">今日の気分スコア</div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-navy-dark mb-2 flex items-center gap-1">
              <Tag className="w-4 h-4 text-orange-600" />
              キーワード
            </h3>
            <div className="flex flex-wrap gap-1">
              {diary.keywords.map((keyword, index) => (
                <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Diary */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-navy-dark mb-3 flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-600" />
              今日の日記
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {diary.diaryEntry}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">AI日記アプリで生成</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 h-[calc(100dvh-90px)] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6 max-w-md mx-auto">
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                <div className="text-center space-y-4">
                  <div className="text-6xl">
                    {getEmotionEmoji(diary.emotionScore)}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-navy-dark mb-2">
                      {diary.emotionScore}/10
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(diary.emotionScore)}`}>
                      <Heart className="w-4 h-4 mr-1" />
                      今日の気分スコア
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Date & Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4 bg-white/90 border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-navy-dark">{diary.date}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {diary.sessionDuration}分間の振り返り
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4 bg-white/90 border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-navy-dark">今日のキーワード</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {diary.keywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-4 bg-white/90 border-pink-100">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-navy-dark">今日のハイライト</h3>
                </div>
                <div className="space-y-2">
                  {diary.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-4 bg-white/90 border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-navy-dark">成長ポイント</h3>
                </div>
                <div className="space-y-2">
                  {diary.growthPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-navy-dark">今日の日記</h3>
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {diary.diaryEntry}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
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
                onClick={handleSaveAsImage}
                variant="outline"
                className="w-full"
                disabled={isGeneratingImage}
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingImage ? '画像生成中...' : '画像で保存'}
              </Button>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 
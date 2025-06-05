'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Star, Heart, Clock, Tag, Lightbulb, Home, Download, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResultScreenData } from '@/types';
import { saveDiary } from '@/lib/diary-storage';
import html2canvas from 'html2canvas';

export default function ResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<ResultScreenData | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('diaryResult');
    if (data) {
      const parsedData = JSON.parse(data);
      setResultData(parsedData);
      
      // 日記をローカルストレージに保存
      saveDiary(parsedData);
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

  const handleSaveAsImage = async () => {
    if (!captureRef.current || !resultData) return;
    
    setIsGeneratingImage(true);
    try {
      // 現在の日付を取得
      const today = new Date();
      const dateString = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 高画質
        width: 400,
        height: 600,
        useCORS: true,
        allowTaint: true,
      });

      // CanvasをBlob化してダウンロード
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `今日の振り返り_${dateString.replace(/\//g, '-')}.png`;
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

      {/* Hidden element for image capture */}
      <div className="fixed -top-[9999px] left-0">
        <div 
          ref={captureRef}
          className="w-[400px] p-6"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(to bottom, #faf5ff, #fdf2f8, #fff7ed)',
          }}
        >
          {resultData && (
            <>
              {/* Header for image */}
              <div className="text-center mb-6">
                <div className="text-2xl mb-2">✨</div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: '#2c3e50' }}>今日の振り返り</h1>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  {new Date().toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Score */}
              <div className="rounded-xl p-4 mb-4 text-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div className="text-4xl mb-2">{getEmotionEmoji(resultData.emotionScore)}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: '#2c3e50' }}>
                  {resultData.emotionScore}/10
                </div>
                <div className="text-sm" style={{ color: '#6b7280' }}>今日の気分スコア</div>
              </div>

              {/* Keywords */}
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <h3 className="font-semibold mb-2 flex items-center gap-1" style={{ color: '#2c3e50' }}>
                  <Tag className="w-4 h-4" style={{ color: '#ea580c' }} />
                  キーワード
                </h3>
                <div className="flex flex-wrap gap-1">
                  {resultData.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 rounded-md text-xs"
                      style={{ backgroundColor: '#fed7aa', color: '#c2410c' }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diary */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <h3 className="font-semibold mb-3 flex items-center gap-1" style={{ color: '#2c3e50' }}>
                  <Clock className="w-4 h-4" style={{ color: '#ea580c' }} />
                  今日の日記
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {resultData.diaryEntry}
                </p>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                <p className="text-xs" style={{ color: '#9ca3af' }}>AI日記アプリで生成</p>
              </div>
            </>
          )}
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
              onClick={() => router.push('/conversation')}
              variant="outline"
              className="w-full border-warm-orange text-warm-orange hover:bg-warm-orange hover:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              会話を振り返る
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
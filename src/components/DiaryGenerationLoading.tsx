'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface DiaryGenerationLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const loadingEmojis = ['☕', '🚗', '🏠'];
const loadingTexts = [
  'あなたの想いを整理しています...',
  '今日の出来事を振り返っています...',
  '心に残った瞬間を見つけています...',
  'もう少しで完成です...'
];

export default function DiaryGenerationLoading({ 
  isVisible, 
  onComplete 
}: DiaryGenerationLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentEmojiIndex(0);
      setCurrentTextIndex(0);
      return;
    }

    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + Math.random() * 3 + 1; // ランダムな速度で進行
      });
    }, 200);

    // 絵文字の切り替えアニメーション
    const emojiInterval = setInterval(() => {
      setCurrentEmojiIndex(prev => (prev + 1) % loadingEmojis.length);
    }, 1000);

    // テキストの切り替え
    const textInterval = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(emojiInterval);
      clearInterval(textInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex flex-col items-center justify-center z-50"
    >
      {/* 背景のグラデーション効果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-transparent to-purple-600/20" />
      
      {/* メインコンテンツ */}
      <div className="relative z-10 text-center space-y-8 px-8">
        {/* タイトル */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">分析中...</h1>
        </motion.div>

        {/* 絵文字アニメーション */}
        <div className="flex justify-center items-center space-x-8 my-12">
          {loadingEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              className="text-6xl"
              animate={{
                scale: currentEmojiIndex === index ? [1, 1.3, 1] : 1,
                opacity: currentEmojiIndex === index ? 1 : 0.3,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                repeat: currentEmojiIndex === index ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* プログレスバー */}
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <motion.div
            key={progress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-sm font-medium"
          >
            {Math.round(progress)}%
          </motion.div>
        </div>

        {/* 動的テキスト */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTextIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white text-base leading-relaxed"
            >
              {loadingTexts[currentTextIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* サブテキスト */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <p className="text-purple-200 text-sm">
            画面を閉じずにそのままお待ちください
          </p>
          <p className="text-purple-300 text-xs">
            ※ 約40-60秒ほどかかります
          </p>
        </motion.div>

        {/* 装飾的な要素 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-ping" />
      </div>
    </motion.div>
  );
} 
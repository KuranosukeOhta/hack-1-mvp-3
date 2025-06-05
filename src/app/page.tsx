'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  const handleStartDiary = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col items-center justify-center p-4 mobile-safe-area">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto text-center space-y-8"
      >
        {/* Logo/Title */}
        <div className="space-y-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3 
            }}
            className="mx-auto w-20 h-20 bg-warm-orange rounded-full flex items-center justify-center"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-navy-dark">
            今日の振り返り
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            AIと一緒に今日1日を<br />
            振り返ってみませんか？
          </p>
        </div>

        {/* Features */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-pink-600" />
              </div>
              <span className="text-gray-700">
                AIとの自然な会話形式
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-gray-700">
                約2分間の気軽な振り返り
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700">
                自動で日記を作成
              </span>
            </div>
          </div>
        </Card>

        {/* Start Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleStartDiary}
            size="lg"
            className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            今日の振り返りを始める
          </Button>
        </motion.div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500">
          準備ができたら、上のボタンを押してください
        </p>
      </motion.div>
    </div>
  );
}

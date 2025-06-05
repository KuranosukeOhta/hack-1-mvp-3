'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';

export default function ConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDuration, setSessionDuration] = useState<number>(0);

  useEffect(() => {
    // LocalStorageから会話履歴を取得
    const savedConversation = localStorage.getItem('lastConversation');
    const savedDuration = localStorage.getItem('lastSessionDuration');
    
    if (savedConversation) {
      const conversationData = JSON.parse(savedConversation);
      setMessages(conversationData);
    }
    
    if (savedDuration) {
      setSessionDuration(parseInt(savedDuration));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (messages.length === 0) {
    return (
      <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md p-4">
          <div className="text-4xl mb-4">💭</div>
          <h2 className="text-xl font-semibold text-navy-dark mb-2">
            会話履歴がありません
          </h2>
          <p className="text-gray-600 mb-6">
            まずは振り返りを始めてみましょう！
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-warm-orange hover:bg-warm-orange/90 text-white"
          >
            ホームに戻る
          </Button>
        </div>
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
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-gray-600 p-2"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              戻る
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-navy-dark flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-warm-orange" />
                会話履歴
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>セッション時間: {formatTime(sessionDuration)}</span>
              </div>
            </div>
            
            <div className="w-[60px]"></div> {/* Spacer for centering */}
          </motion.div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col px-4">
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <Card className={`p-3 ${
                        message.sender === 'user' 
                          ? 'bg-warm-orange text-white' 
                          : 'bg-white border-orange-100'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </Card>
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="min-h-[80px] flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-orange-100 p-4 relative z-40">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-3"
          >
            <p className="text-sm text-gray-600">
              今日の振り返りはいかがでしたか？
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/chat')}
                variant="outline"
                className="flex-1"
              >
                新しい振り返りを始める
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="flex-1 bg-warm-orange hover:bg-warm-orange/90 text-white"
              >
                ホームに戻る
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
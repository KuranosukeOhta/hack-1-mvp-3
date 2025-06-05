'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';
import DiaryGenerationLoading from '@/components/DiaryGenerationLoading';

const CHAT_DURATION = 120; // 2分間（秒）

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(CHAT_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showGenerationLoading, setShowGenerationLoading] = useState(false);
  const [isExtendedMode, setIsExtendedMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // タイマー機能
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // 延長モードではタイマーを停止
    if (isActive && timeRemaining > 0 && !isExtendedMode) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            setShowTimeUpDialog(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, isExtendedMode]);

  // 初回メッセージ
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'こんにちは！今日1日お疲れさまでした。今日はどんな1日でしたか？何か印象的なことがあれば教えてください😊\n\n💡 少し話したら、いつでも「まとめる」ボタンで振り返りを完了できます',
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setIsActive(true);
  }, []);

  // 自動スクロール
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'すみません、エラーが発生しました。もう一度お試しください。',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((CHAT_DURATION - timeRemaining) / CHAT_DURATION) * 100;

  const handleFinishChat = async () => {
    setShowTimeUpDialog(false);
    setShowGenerationLoading(true);
    
    try {
      const response = await fetch('/api/generate-diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      if (data.success) {
        // 結果をLocalStorageに保存してリザルト画面へ
        localStorage.setItem('diaryResult', JSON.stringify({
          diaryEntry: data.diaryEntry,
          emotionScore: data.emotionScore,
          keywords: data.keywords,
          highlights: data.highlights,
          growthPoints: data.growthPoints,
          sessionDuration: Math.round((CHAT_DURATION - timeRemaining) / 60),
        }));
        
        // ローディング完了後にリザルト画面へ遷移
        setTimeout(() => {
          setShowGenerationLoading(false);
          router.push('/result');
        }, 1000);
      }
    } catch (error) {
      console.error('Diary generation error:', error);
      setShowGenerationLoading(false);
    }
  };

  const continueChat = () => {
    setShowTimeUpDialog(false);
    setIsExtendedMode(true); // 延長モードに入る
    setIsActive(true);
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col">
      {/* Fixed Header - 高さを明確に定義 */}
      <div className="h-[90px] flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-orange-100 p-4 relative z-40">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-navy-dark">今日の振り返り</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {isExtendedMode ? (
                <span className="text-green-600 font-medium">延長中</span>
              ) : (
                <span>{formatTime(timeRemaining)}</span>
              )}
            </div>
          </div>
          {!isExtendedMode && (
            <Progress value={progressPercentage} className="h-2" />
          )}
        </div>
      </div>

      {/* Chat Area - calc()で正確な高さを計算 */}
      <div className="flex-1 h-[calc(100dvh-170px)] overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col px-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <Card className={`max-w-[80%] p-3 ${
                      message.sender === 'user' 
                        ? 'bg-warm-orange text-white' 
                        : 'bg-white border-orange-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <Card className="bg-white border-orange-100 p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Fixed Input Area - 高さを明確に定義 */}
      <div className="min-h-[80px] flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-orange-100 p-4 relative z-40">
        <div className="max-w-md mx-auto space-y-3">
          {/* メッセージが3往復以上、または延長モードの場合は手動完了ボタンを表示 */}
          {((messages.length >= 4 && !isExtendedMode) || isExtendedMode) && isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                onClick={handleFinishChat}
                variant={isExtendedMode ? "default" : "outline"}
                size="sm"
                className={`text-sm ${
                  isExtendedMode 
                    ? "bg-warm-orange hover:bg-warm-orange/90 text-white" 
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
                disabled={showGenerationLoading}
              >
                {isExtendedMode ? "振り返りをまとめる" : "今すぐ振り返りをまとめる"}
              </Button>
            </motion.div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              disabled={isLoading || !isActive || showGenerationLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim() || !isActive || showGenerationLoading}
              size="icon"
              className="bg-warm-orange hover:bg-warm-orange/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Diary Generation Loading */}
      <DiaryGenerationLoading 
        isVisible={showGenerationLoading}
        onComplete={() => {
          setShowGenerationLoading(false);
          router.push('/result');
        }}
      />

      {/* Time Up Dialog */}
      <AnimatePresence>
        {showTimeUpDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-navy-dark mb-2">
                  時間になりました！
                </h3>
                <p className="text-gray-600">
                  今日の振り返りをまとめますか？
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleFinishChat}
                  className="w-full bg-warm-orange hover:bg-warm-orange/90"
                  disabled={showGenerationLoading}
                >
                  まとめる
                </Button>
                <Button
                  onClick={continueChat}
                  variant="outline"
                  className="w-full"
                >
                  延長する（時間無制限）
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
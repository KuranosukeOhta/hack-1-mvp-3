'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Chrome, Mail } from 'lucide-react';
import { getAuthState, isOnboardingComplete } from '@/lib/profile-storage';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // モックログイン関数（将来的にGoogleログインに置き換え）
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // モックの遅延
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 既存のユーザープロフィールがあるかチェック
    if (isOnboardingComplete()) {
      // オンボーディング完了済み → メイン画面へ
      router.push('/');
    } else {
      // 新規ユーザー → プロフィール設定画面へ
      router.push('/profile');
    }
    
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    
    // モックの遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 新規ユーザーとしてプロフィール設定画面へ
    router.push('/profile');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[100dvh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* ヘッダー */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              📖
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-navy-dark mb-3">
                AI日記アプリ
              </h1>
              <p className="text-gray-600 text-lg">
                毎日5分の会話で<br />
                あなただけの日記を作成
              </p>
            </div>
          </div>

          {/* 特徴説明 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold text-navy-dark">AIとの対話</h3>
                  <p className="text-sm text-gray-600">自然な会話で今日を振り返り</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✨</div>
                <div>
                  <h3 className="font-semibold text-navy-dark">自動生成</h3>
                  <p className="text-sm text-gray-600">美しい日記を自動で作成</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <h3 className="font-semibold text-navy-dark">いつでもどこでも</h3>
                  <p className="text-sm text-gray-600">スマホで手軽に記録</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ログインボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 text-lg font-medium"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ログイン中...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Chrome className="w-5 h-5" />
                  Googleでログイン
                </div>
              )}
            </Button>

            <Button
              onClick={handleEmailLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full py-3 text-lg font-medium"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                メールでログイン
              </div>
            </Button>
          </motion.div>

          {/* プライバシー情報 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              ログインすることで、<a href="#" className="underline">利用規約</a>と<br />
              <a href="#" className="underline">プライバシーポリシー</a>に同意したものとみなします。
            </p>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                <strong>🔒 MVPバージョン</strong><br />
                現在は開発版のため、実際の認証は行われません。<br />
                データはブラウザに保存されます。
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 
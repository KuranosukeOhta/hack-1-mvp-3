'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '@/types';
import { saveUserProfile } from '@/lib/profile-storage';

const GENDER_OPTIONS = [
  { id: 'male', label: '男性' },
  { id: 'female', label: '女性' },
  { id: 'other', label: 'その他' },
  { id: 'prefer_not_to_say', label: '答えたくない' }
];

const AGE_OPTIONS = [
  { id: 'teens', label: '10代' },
  { id: 'twenties', label: '20代' },
  { id: 'thirties', label: '30代' },
  { id: 'forties', label: '40代' },
  { id: 'fifties', label: '50代' },
  { id: 'sixties_plus', label: '60代以上' },
  { id: 'prefer_not_to_say', label: '答えたくない' }
];

const OCCUPATION_OPTIONS = [
  { id: 'student', label: '学生' },
  { id: 'office_worker', label: '会社員' },
  { id: 'freelancer', label: 'フリーランス' },
  { id: 'entrepreneur', label: '経営者・起業家' },
  { id: 'public_servant', label: '公務員' },
  { id: 'teacher', label: '教育関係' },
  { id: 'healthcare', label: '医療・介護' },
  { id: 'engineer', label: 'エンジニア' },
  { id: 'designer', label: 'デザイナー' },
  { id: 'sales', label: '営業' },
  { id: 'service', label: 'サービス業' },
  { id: 'homemaker', label: '主婦・主夫' },
  { id: 'retired', label: '退職・年金生活' },
  { id: 'other', label: 'その他' },
  { id: 'prefer_not_to_say', label: '答えたくない' }
];

const INTEREST_OPTIONS = [
  { id: 'reading', label: '読書' },
  { id: 'movies', label: '映画・ドラマ' },
  { id: 'music', label: '音楽' },
  { id: 'sports', label: 'スポーツ' },
  { id: 'cooking', label: '料理' },
  { id: 'travel', label: '旅行' },
  { id: 'gaming', label: 'ゲーム' },
  { id: 'art', label: 'アート' },
  { id: 'photography', label: '写真' },
  { id: 'fashion', label: 'ファッション' },
  { id: 'technology', label: 'テクノロジー' },
  { id: 'nature', label: '自然・アウトドア' },
  { id: 'fitness', label: 'フィットネス' },
  { id: 'pets', label: 'ペット' },
  { id: 'family', label: '家族との時間' }
];

export default function ProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedOccupation, setSelectedOccupation] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('ニックネームを入力してください');
      return;
    }

    setIsSubmitting(true);

    const profile: UserProfile = {
      id: Date.now().toString(),
      nickname: nickname.trim(),
      gender: selectedGender,
      age: selectedAge,
      occupation: selectedOccupation,
      interests: selectedInterests,
      createdAt: new Date().toISOString(),
      isOnboardingComplete: true
    };

    try {
      saveUserProfile(profile);
      
      // プロフィール設定完了後、メイン画面へ
      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Profile save error:', error);
      setIsSubmitting(false);
      alert('プロフィールの保存に失敗しました。もう一度お試しください。');
    }
  };

  const isFormValid = nickname.trim().length > 0;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-orange-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* ヘッダー */}
          <div className="text-center space-y-4">
            <div className="text-4xl">👋</div>
            <div>
              <h1 className="text-2xl font-bold text-navy-dark mb-2">
                はじめまして！
              </h1>
              <p className="text-gray-600">
                あなたのことを少し教えてください。<br />
                より良い日記作成をサポートします。
              </p>
            </div>
          </div>

          {/* ニックネーム */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-navy-dark mb-2">
                ニックネーム <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                日記の中で呼んでほしい名前を教えてください
              </p>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例：さとし、花子、Alex..."
                className="text-base"
                maxLength={20}
              />
            </div>
          </Card>

          {/* 性別 */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-navy-dark mb-2">性別</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {GENDER_OPTIONS.map((option) => (
                  <Badge
                    key={option.id}
                    variant={selectedGender === option.id ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      selectedGender === option.id
                        ? "bg-warm-orange text-white hover:bg-warm-orange/90"
                        : "hover:bg-orange-50"
                    }`}
                    onClick={() => setSelectedGender(option.id)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* 年齢 */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-navy-dark mb-2">年齢</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {AGE_OPTIONS.map((option) => (
                  <Badge
                    key={option.id}
                    variant={selectedAge === option.id ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      selectedAge === option.id
                        ? "bg-warm-orange text-white hover:bg-warm-orange/90"
                        : "hover:bg-orange-50"
                    }`}
                    onClick={() => setSelectedAge(option.id)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* 職業 */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-navy-dark mb-2">職業</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {OCCUPATION_OPTIONS.map((option) => (
                  <Badge
                    key={option.id}
                    variant={selectedOccupation === option.id ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      selectedOccupation === option.id
                        ? "bg-warm-orange text-white hover:bg-warm-orange/90"
                        : "hover:bg-orange-50"
                    }`}
                    onClick={() => setSelectedOccupation(option.id)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* 興味・関心 */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-navy-dark mb-2">興味・関心</h3>
              <p className="text-sm text-gray-500 mb-3">
                複数選択可能です（任意）
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((option) => (
                  <Badge
                    key={option.id}
                    variant={selectedInterests.includes(option.id) ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      selectedInterests.includes(option.id)
                        ? "bg-warm-pink text-white hover:bg-warm-pink/90"
                        : "hover:bg-pink-50"
                    }`}
                    onClick={() => handleInterestToggle(option.id)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* 完了ボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white py-3 text-lg font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  設定中...
                </div>
              ) : (
                '日記を始める'
              )}
            </Button>
          </motion.div>

          {/* プライバシー説明 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              入力いただいた情報は日記作成の個人化にのみ使用され、<br />
              あなたのプライバシーは厳重に保護されます。
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 
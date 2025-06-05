import { UserProfile, AuthState } from '@/types';

const PROFILE_STORAGE_KEY = 'diary-user-profile';
const AUTH_STORAGE_KEY = 'diary-auth-state';

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    
    // 認証状態も更新
    const authState: AuthState = {
      isAuthenticated: true,
      user: profile
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw new Error('プロフィールの保存に失敗しました');
  }
}

export function getUserProfile(): UserProfile | null {
  try {
    const profileData = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!profileData) return null;
    
    return JSON.parse(profileData) as UserProfile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

export function getAuthState(): AuthState {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) {
      return { isAuthenticated: false, user: null };
    }
    
    return JSON.parse(authData) as AuthState;
  } catch (error) {
    console.error('Failed to get auth state:', error);
    return { isAuthenticated: false, user: null };
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  try {
    const currentProfile = getUserProfile();
    if (!currentProfile) {
      throw new Error('プロフィールが見つかりません');
    }
    
    const updatedProfile = { ...currentProfile, ...updates };
    saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('プロフィールの更新に失敗しました');
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user profile:', error);
  }
}

export function isOnboardingComplete(): boolean {
  const profile = getUserProfile();
  return profile?.isOnboardingComplete ?? false;
}

// プロフィール情報をフォーマットして表示用の文字列を生成
export function formatProfileForAI(profile: UserProfile): string {
  const parts: string[] = [];
  
  if (profile.nickname) {
    parts.push(`ニックネーム: ${profile.nickname}`);
  }
  
  if (profile.gender && profile.gender !== 'prefer_not_to_say') {
    const genderLabels: Record<string, string> = {
      'male': '男性',
      'female': '女性',
      'other': 'その他'
    };
    parts.push(`性別: ${genderLabels[profile.gender] || profile.gender}`);
  }
  
  if (profile.age && profile.age !== 'prefer_not_to_say') {
    const ageLabels: Record<string, string> = {
      'teens': '10代',
      'twenties': '20代',
      'thirties': '30代',
      'forties': '40代',
      'fifties': '50代',
      'sixties_plus': '60代以上'
    };
    parts.push(`年齢: ${ageLabels[profile.age] || profile.age}`);
  }
  
  if (profile.occupation && profile.occupation !== 'prefer_not_to_say') {
    const occupationLabels: Record<string, string> = {
      'student': '学生',
      'office_worker': '会社員',
      'freelancer': 'フリーランス',
      'entrepreneur': '経営者・起業家',
      'public_servant': '公務員',
      'teacher': '教育関係',
      'healthcare': '医療・介護',
      'engineer': 'エンジニア',
      'designer': 'デザイナー',
      'sales': '営業',
      'service': 'サービス業',
      'homemaker': '主婦・主夫',
      'retired': '退職・年金生活',
      'other': 'その他'
    };
    parts.push(`職業: ${occupationLabels[profile.occupation] || profile.occupation}`);
  }
  
  if (profile.interests && profile.interests.length > 0) {
    const interestLabels: Record<string, string> = {
      'reading': '読書',
      'movies': '映画・ドラマ',
      'music': '音楽',
      'sports': 'スポーツ',
      'cooking': '料理',
      'travel': '旅行',
      'gaming': 'ゲーム',
      'art': 'アート',
      'photography': '写真',
      'fashion': 'ファッション',
      'technology': 'テクノロジー',
      'nature': '自然・アウトドア',
      'fitness': 'フィットネス',
      'pets': 'ペット',
      'family': '家族との時間'
    };
    
    const interests = profile.interests.map(id => interestLabels[id] || id);
    parts.push(`興味・関心: ${interests.join('、')}`);
  }
  
  return parts.join('\n');
} 
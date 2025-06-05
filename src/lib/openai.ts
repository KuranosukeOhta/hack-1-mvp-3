import OpenAI from 'openai';
import { Message } from '@/types';
import { getDiariesSummary } from './diary-storage';
import { getUserProfile, formatProfileForAI } from './profile-storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendChatMessage(messages: Message[]): Promise<string> {
  try {
    const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Get user profile and past diaries summary for context
    const userProfile = getUserProfile();
    const diariesSummary = getDiariesSummary();
    
    // Format user profile information
    const profileInfo = userProfile ? formatProfileForAI(userProfile) : '';
    
    // Add system prompt for diary conversation
    const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `あなたは優しい聞き手として、ユーザーの1日の振り返りをサポートします。

${userProfile ? `ユーザー情報：
${profileInfo}

ユーザーのニックネーム「${userProfile.nickname}」を適度に使って親しみやすく話しかけてください。` : ''}

役割：
- 共感的で温かい反応を示す
- 自然な流れで質問を投げかける
- ユーザーが話しやすい雰囲気を作る
- ユーザーの背景（年齢、職業、興味など）を考慮した会話
- アドバイスは控えめに、主に聞くことに徹する

会話のゴール：
- ユーザーの今日1日の出来事を聞き出す
- 感情や気持ちを引き出す
- 小さな成長や気づきを見つける
- ユーザーの興味や職業に関連する話題があれば自然に触れる

過去の記録（参考情報）：
${diariesSummary}

話し方：
- 親しみやすく、カジュアルなトーン
- 相槌や共感を大切に
- 質問は1回につき1つまで
- 過去の記録と比較して変化や成長を認識できれば自然に言及
- ユーザーの属性に合わせた適切な表現を使用
- 200字以内で簡潔に返答`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [systemPrompt, ...chatMessages],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'すみません、うまく返答できませんでした。';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('AIとの通信でエラーが発生しました。');
  }
}

export async function generateDiarySummary(messages: Message[]): Promise<{
  diaryEntry: string;
  emotionScore: number;
  keywords: string[];
  highlights: string[];
  growthPoints: string[];
}> {
  try {
    const conversationText = messages
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.content)
      .join('\n');

    // Get user profile for personalized diary generation
    const userProfile = getUserProfile();
    const profileInfo = userProfile ? formatProfileForAI(userProfile) : '';

    const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `ユーザーとの会話から、以下の形式でJSONを生成してください：

{
  "diaryEntry": "自然な日記形式のテキスト（400字程度）",
  "emotionScore": 1-10の感情スコア（10が最高の気分）,
  "keywords": ["今日の重要なキーワード配列"],
  "highlights": ["今日のハイライト配列"],
  "growthPoints": ["成長や気づきのポイント配列"]
}

${userProfile ? `ユーザー情報：
${profileInfo}

日記生成時にユーザーの背景（年齢、職業、興味など）を考慮してください。ニックネーム「${userProfile.nickname}」として一人称で書いてください。` : ''}

【重要な制約】：
- 会話に含まれていない情報は一切含めないでください
- ユーザーが明確に言及していない出来事、感情、人物は書かないでください
- 推測や想像で内容を補完しないでください
- 実際の会話内容のみを基に生成してください

要求事項：
- diaryEntryは温かみのある、自然な日記調で、ユーザーが実際に話した内容のみを使用
- ユーザーの属性に応じた適切な表現やトーンを使用
- emotionScoreはユーザーの発言と表現された気持ちのみを反映
- keywordsは3-5個程度、会話で実際に出てきた単語やテーマのみ
- highlightsは1-3個、ユーザーが具体的に述べた出来事のみ
- growthPointsは1-3個、ユーザーが実際に表現した気づきや学びのみ
- 会話に出てこない情報は絶対に含めない
- 必ず有効なJSONで返答`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        systemPrompt,
        {
          role: 'user',
          content: `以下の会話から日記を生成してください：\n\n${conversationText}`
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AIからの返答が空でした');
    }

    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('Diary Generation Error:', error);
    throw new Error('日記の生成でエラーが発生しました。');
  }
} 
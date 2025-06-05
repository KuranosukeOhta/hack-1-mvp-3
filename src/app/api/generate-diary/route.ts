import { NextRequest, NextResponse } from 'next/server';
import { generateDiarySummary } from '@/lib/openai';
import { Message } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'メッセージが正しく送信されませんでした' },
        { status: 400 }
      );
    }

    const result = await generateDiarySummary(messages);

    return NextResponse.json({ 
      success: true, 
      ...result 
    });

  } catch (error) {
    console.error('Diary Generation API Error:', error);
    return NextResponse.json(
      { error: '日記の生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
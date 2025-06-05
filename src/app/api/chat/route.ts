import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/openai';
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

    const response = await sendChatMessage(messages);

    return NextResponse.json({ 
      success: true, 
      message: response 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'チャットの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
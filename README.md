# 今日の振り返り - AI日記アプリ

AIと一緒に今日1日を振り返って、自動で日記を作成するアプリです。

## 🌟 特徴

- **AIとの自然な会話**: GPT-4oを使用した優しい聞き手
- **2分間の気軽な振り返り**: タイマー機能付きで無理なく続けられる
- **自動日記生成**: 会話内容から感情豊かな日記を自動作成
- **ゲーム風リザルト**: 楽しい達成感のあるリザルト画面
- **スマホファースト**: レスポンシブデザインでモバイル最適化

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript
- **UIライブラリ**: shadcn/ui, Tailwind CSS
- **アニメーション**: Framer Motion
- **AI**: OpenAI GPT-4o API
- **アイコン**: Lucide React

## 🚀 セットアップ

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd diary-mvp
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
`.env.local` ファイルを作成し、以下を追加：
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **開発サーバーの起動**
```bash
npm run dev
```

5. **ブラウザでアクセス**
`http://localhost:3000` にアクセス

## 📱 使い方

1. **開始画面**: 「今日の振り返りを始める」ボタンをクリック
2. **チャット画面**: AIと2分間の自然な会話
3. **リザルト画面**: 自動生成された日記と分析結果を確認

## 🔑 OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. アカウントを作成またはログイン
3. API キーを生成
4. `.env.local` ファイルに設定

## 📂 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # チャット機能
│   │   └── generate-diary/ # 日記生成
│   ├── chat/              # チャット画面
│   ├── result/            # リザルト画面
│   ├── layout.tsx         # レイアウト
│   ├── page.tsx           # ホーム画面
│   └── globals.css        # グローバルスタイル
├── components/            # UIコンポーネント
│   └── ui/               # shadcn/ui components
├── lib/                   # ライブラリファイル
│   ├── openai.ts         # OpenAI API統合
│   └── utils.ts          # ユーティリティ
└── types/                 # TypeScript型定義
    └── index.ts
```

## 🚧 開発中の機能

- [ ] 音声会話機能（OpenAI Realtime API）
- [ ] データベース連携
- [ ] ユーザー認証
- [ ] 日記履歴機能
- [ ] PWA対応

## 📄 ライセンス

MIT License

## 🤝 貢献

プルリクエストや Issue は大歓迎です！

---

**注意**: このアプリを使用するには、有効なOpenAI APIキーが必要です。APIの使用には料金が発生する場合があります。

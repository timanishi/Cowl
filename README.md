# Cowl - グループ支払い管理アプリ

![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)

Cowlは友達との旅行や食事会で、複雑な支払いを簡単に整理し、透明な精算を実現するWebアプリケーションです。

## ✨ 主な機能

### 🔐 認証システム
- Google OAuthによる簡単ログイン
- セッション管理（NextAuth.js）

### 💰 ウォレット管理
- グループ専用ウォレット作成
- 招待コードによるメンバー招待
- オーナー/メンバーの権限管理
- ウォレット編集・削除機能

### 📝 支払い記録
- 柔軟な支払い記録（金額、内容、カテゴリー）
- 均等割り・カスタム分割対応
- 支払い履歴の編集・削除
- リアルタイム同期

### 🧮 精算機能
- 自動的な収支計算
- 最小回数での精算提案
- 最適化アルゴリズムによる送金計画
- 視覚的な残高表示

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15.1.0** - React フレームワーク（App Router）
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファースト CSS フレームワーク
- **NextAuth.js** - 認証ライブラリ

### バックエンド
- **Next.js API Routes** - サーバーサイド API
- **Prisma ORM** - データベース ORM
- **PostgreSQL** - リレーショナルデータベース（Supabase）

### 開発ツール
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット
- **TypeScript** - 型チェック

## 🚀 セットアップ

### 必要環境
- Node.js 18.0.0 以上
- npm または yarn
- PostgreSQL データベース（Supabase推奨）

### 1. リポジトリのクローン
```bash
git clone https://github.com/timanishi/Cowl.git
cd Cowl
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# データベース
DATABASE_URL="postgresql://username:password@localhost:5432/cowl"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. データベースのセットアップ
```bash
# Prisma マイグレーション実行
npx prisma migrate dev

# Prisma クライアント生成
npx prisma generate
```

### 5. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションが http://localhost:3000 で起動します。

## 📊 データベース構造

```
Users ──┬── WalletMembers ──── Wallets
        ├── Payments
        └── PaymentParticipants

Wallets ──┬── WalletMembers
          ├── Payments
          └── Settlements（将来実装）
```

### 主要テーブル
- **Users** - ユーザー情報
- **Wallets** - グループウォレット
- **WalletMembers** - ウォレットメンバー関係
- **Payments** - 支払い記録
- **PaymentParticipants** - 支払い参加者

## 🎯 使用方法

### 1. アカウント作成
1. Googleアカウントでログイン
2. プロフィール情報の確認

### 2. ウォレット作成
1. ダッシュボードから「新しいウォレット」を作成
2. ウォレット名と説明を入力
3. 招待コードでメンバーを招待

### 3. 支払い記録
1. ウォレット詳細ページで「支払いを追加」
2. 金額、内容、カテゴリーを入力
3. 参加者と分割方法を選択
4. 保存

### 4. 精算計算
1. 「精算計算」ボタンをクリック
2. 各メンバーの収支を確認
3. 最適化された送金プランを確認
4. 実際の送金後に「完了マーク」

## 📱 レスポンシブ対応

- **モバイルファースト設計**
- スマートフォン、タブレット、デスクトップに対応
- タッチ操作に最適化されたUI

## 🔒 セキュリティ

- OAuth 2.0による安全な認証
- セッションベースの認証管理
- CSRF保護
- SQL インジェクション対策（Prisma ORM）

## 🧪 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクションサーバー起動
npm start

# リント実行
npm run lint

# Prisma Studio（データベースGUI）
npx prisma studio
```

## 📦 デプロイ

### Vercel（推奨）
1. Vercelアカウントにプロジェクトを接続
2. 環境変数を設定
3. 自動デプロイ

### その他のプラットフォーム
- Railway
- Heroku
- AWS
- Google Cloud Platform

## 🤝 コントリビュート

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📋 今後の予定

- [ ] レシート撮影・OCR機能
- [ ] プッシュ通知
- [ ] PWA対応
- [ ] 多言語対応
- [ ] ダークモード
- [ ] エクスポート機能（CSV/PDF）
- [ ] プレミアムプラン

## 🐛 既知の問題

- Settlement機能は部分実装（データベースマイグレーション要）
- 一部のESLint警告（useEffect依存配列）

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👨‍💻 作成者

**Timanishi**
- GitHub: [@timanishi](https://github.com/timanishi)

## 🙏 謝辞

このプロジェクトは[Claude Code](https://claude.ai/code)との協力により開発されました。

---

⭐ このプロジェクトが役に立ったら、ぜひスターをお願いします！# Force deploy

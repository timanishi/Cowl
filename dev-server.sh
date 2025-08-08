#!/bin/bash

echo "🚀 Cowl開発サーバーを起動します..."
echo ""
echo "📍 URL: http://localhost:3000"
echo "📍 Network: http://10.255.255.254:3000"
echo ""
echo "⚠️  サーバーを停止するには Ctrl+C を押してください"
echo "=================================================="
echo ""

# PIDファイルのクリーンアップ
if [ -f ".next/server.pid" ]; then
    rm .next/server.pid
fi

# 既存のポート3000プロセスを終了
echo "ポート3000をクリーンアップ中..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 開発サーバー起動
npm run dev
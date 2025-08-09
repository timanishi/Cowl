#!/usr/bin/env node

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

console.log('🔍 環境変数チェック...\n');

let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: 未設定`);
  } else {
    console.log(`✅ ${varName}: 設定済み`);
  }
});

console.log('\n');

if (missingVars.length > 0) {
  console.log('🚨 以下の環境変数が不足しています:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nVercelダッシュボードで設定してください。');
  process.exit(1);
} else {
  console.log('🎉 すべての必要な環境変数が設定されています！');
  process.exit(0);
}
import Footer from "@/components/ui/footer";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cowl",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "友達との旅行や食事で使える精算アプリ。グループでの支払い記録・精算管理が簡単にできます。",
    "url": "https://cowl.vercel.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "featureList": [
      "グループでの支払い記録",
      "自動精算計算", 
      "リアルタイム同期",
      "招待リンクで簡単参加"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
    <main className="flex-1 px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cowl
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          友達との旅行や食事で使える<br />
          精算アプリ
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            シンプルな精算管理
          </h2>
          <p className="text-gray-600 mb-6">
            共用ウォレットで支払いを記録し、<br />
            透明な精算を実現します
          </p>
          
          <div className="space-y-3">
            <a
              href="/auth/signin"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium inline-block transition-colors"
            >
              今すぐ始める
            </a>
            
            <div className="text-sm text-gray-500">
              Googleアカウントでかんたんログイン
            </div>
          </div>
        </div>

        <div className="text-left space-y-4">
          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">✨ 主な機能</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• グループでの支払い記録</li>
              <li>• 自動精算計算</li>
              <li>• リアルタイム同期</li>
              <li>• 招待リンクで簡単参加</li>
            </ul>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">🚀 使い方</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <div>共用ウォレットを作成</div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <div>友達を招待リンクで招待</div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <div>支払いを記録していく</div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                <div>自動で精算額を計算・提案</div>
              </div>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">💡 こんな時に便利</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 友達との旅行での宿泊費・交通費・食事代</li>
              <li>• 職場の同僚とのランチ代</li>
              <li>• サークル活動での備品購入費</li>
              <li>• 家族でのレジャー費用</li>
              <li>• シェアハウスでの共益費</li>
            </ul>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">🔒 安心・安全</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Googleアカウントによる安全な認証</li>
              <li>• 支払い情報は暗号化して保存</li>
              <li>• プライバシーポリシーに準拠</li>
              <li>• 金銭のやり取りは記録のみ（決済機能なし）</li>
            </ul>
          </div>
        </div>

      </div>
    </main>
    <Footer />
    </div>
    </>
  )
}
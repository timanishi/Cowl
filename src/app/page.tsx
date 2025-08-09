import Footer from "@/components/ui/footer";

export default function Home() {
  return (
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
        </div>

      </div>
    </main>
    <Footer />
    </div>
  )
}
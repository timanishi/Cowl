import Footer from "@/components/ui/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. はじめに</h2>
            <p>
              Cowl（以下「当サービス」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。
              本プライバシーポリシーは、当サービスにおける個人情報の取扱いについて説明いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 収集する情報</h2>
            <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 ユーザーが提供する情報</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>メールアドレス（認証用）</li>
              <li>プロフィール情報（名前、アイコンなど）</li>
              <li>支払い情報（金額、説明など）</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 自動的に収集される情報</h3>
            <ul className="list-disc ml-6">
              <li>IPアドレス</li>
              <li>ブラウザ情報</li>
              <li>アクセス日時</li>
              <li>利用状況データ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 情報の利用目的</h2>
            <ul className="list-disc ml-6">
              <li>サービスの提供および運営</li>
              <li>ユーザー認証</li>
              <li>カスタマーサポート</li>
              <li>サービスの改善および開発</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 情報の共有</h2>
            <p>
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有いたしません：
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>ユーザーの同意がある場合</li>
              <li>法的要請がある場合</li>
              <li>サービス提供に必要な第三者サービス（認証プロバイダなど）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 広告について</h2>
            <p>
              当サービスではGoogle AdSenseを使用して広告を表示しています。Google AdSenseは、
              ユーザーの関心に基づいた広告を配信するため、Cookieを使用して情報を収集することがあります。
              詳細については、<a href="https://policies.google.com/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー</a>をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. セキュリティ</h2>
            <p>
              当サービスは、ユーザーの個人情報を保護するため、適切な技術的・組織的措置を講じています。
              ただし、インターネット上での情報伝送には完全なセキュリティは保証されないことをご了承ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. ユーザーの権利</h2>
            <p>ユーザーは以下の権利を有します：</p>
            <ul className="list-disc ml-6 mt-2">
              <li>個人情報の開示請求</li>
              <li>個人情報の訂正・削除請求</li>
              <li>個人情報の利用停止請求</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. お問い合わせ</h2>
            <p>
              個人情報の取扱いに関するお問い合わせは、<a href="/contact" className="text-blue-600 underline">お問い合わせページ</a>からご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
              重要な変更がある場合は、サービス内で通知いたします。
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600">
              制定日: 2025年1月<br />
              最終更新日: 2025年1月
            </p>
          </section>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
import Footer from "@/components/ui/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、Cowl（以下「当サービス」）の利用に関する条件を定めるものです。
              ユーザーは、当サービスを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第2条（定義）</h2>
            <p>本規約において、次の各号に掲げる用語の意義は、当該各号に定めるところによります。</p>
            <ul className="list-decimal ml-6 mt-2">
              <li>「当サービス」とは、共用ウォレットサービス「Cowl」をいいます。</li>
              <li>「ユーザー」とは、当サービスを利用する個人または法人をいいます。</li>
              <li>「ウォレット」とは、当サービス内で作成される支払い管理単位をいいます。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第3条（サービス内容）</h2>
            <p>当サービスは、以下の機能を提供します：</p>
            <ul className="list-disc ml-6 mt-2">
              <li>共用ウォレットの作成・管理</li>
              <li>支払い記録の登録・編集</li>
              <li>精算計算と提案</li>
              <li>メンバー間での支払い状況の共有</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第4条（利用登録）</h2>
            <p>
              当サービスの利用には、Google、GitHub等の外部認証サービスによる認証が必要です。
              ユーザーは正確な情報を提供し、変更がある場合は速やかに更新する責任を負います。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第5条（禁止事項）</h2>
            <p>ユーザーは、当サービスの利用にあたり、以下の行為を行ってはなりません：</p>
            <ul className="list-disc ml-6 mt-2">
              <li>法令または公序良俗に反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>虚偽の情報を登録する行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第6条（知的財産権）</h2>
            <p>
              当サービスに関するすべての知的財産権は、当サービス運営者または正当な権利者に帰属します。
              ユーザーは、当サービスの利用に関して必要な範囲でのみ、これらを利用することができます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第7条（免責事項）</h2>
            <p>
              当サービスは「現状有姿」で提供され、運営者は明示・黙示を問わず一切の保証を行いません。
              当サービスの利用により生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第8条（サービスの変更・終了）</h2>
            <p>
              運営者は、ユーザーに事前に通知することなく、当サービスの内容を変更し、
              または当サービスの提供を終了することができます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第9条（利用規約の変更）</h2>
            <p>
              運営者は、必要と判断した場合には、ユーザーに通知することなく、
              いつでも本規約を変更することができます。変更後の利用規約は、
              当サービス上に表示した時点から効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第10条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈にあたっては、日本法を準拠法とします。
              当サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を
              専属的合意管轄とします。
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
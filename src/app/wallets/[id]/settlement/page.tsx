'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import BalanceOverview from '@/components/settlement/balance-overview'
import SettlementProposal from '@/components/settlement/settlement-proposal'

interface SettlementData {
  walletId: string
  walletName: string
  memberBalances: any[]
  settlementTransactions: any[]
  needsSettlement: boolean
  totalExpenses: number
  totalMembers: number
  totalPayments: number
  calculatedAt: string
  existingSettlements: any[]
}

export default function SettlementPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settlement, setSettlement] = useState<SettlementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [walletId, setWalletId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setWalletId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (walletId) {
      fetchSettlement()
    }
  }, [session, status, router, walletId])

  const fetchSettlement = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wallets/${walletId}/settlement`)
      if (response.ok) {
        const data = await response.json()
        setSettlement(data)
      } else if (response.status === 404) {
        setError('ウォレットが見つかりません')
      } else if (response.status === 403) {
        setError('このウォレットにアクセスする権限がありません')
      } else {
        setError('精算情報の読み込みに失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSettlementComplete = () => {
    fetchSettlement() // 精算完了後に再取得
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">精算情報を計算中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    )
  }

  if (!settlement) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/wallets/${walletId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{settlement.walletName}</h1>
              <p className="text-sm text-gray-600">精算ページ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ページタイトル */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">精算計算</h2>
            <p className="text-gray-600">
              最終更新: {new Date(settlement.calculatedAt).toLocaleString('ja-JP')}
            </p>
          </div>

          {/* 残高状況 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">収支状況</h3>
            <BalanceOverview 
              memberBalances={settlement.memberBalances}
              totalExpenses={settlement.totalExpenses}
            />
          </div>

          {/* 既存の精算記録 */}
          {settlement.existingSettlements && settlement.existingSettlements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">精算履歴</h3>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  {settlement.existingSettlements.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">
                            {record.fromUser.name} → {record.toUser.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(record.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <span className="font-bold text-lg">¥{record.amount.toLocaleString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.isCompleted ? '完了' : '未完了'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 精算提案 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">精算方法</h3>
            <SettlementProposal
              walletId={settlement.walletId}
              transactions={settlement.settlementTransactions}
              needsSettlement={settlement.needsSettlement}
              onSettlementComplete={handleSettlementComplete}
            />
          </div>

          {/* 統計情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">統計情報</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{settlement.totalMembers}</div>
                <div className="text-sm text-gray-600">参加メンバー</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{settlement.totalPayments}</div>
                <div className="text-sm text-gray-600">支払い回数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {settlement.settlementTransactions.length}
                </div>
                <div className="text-sm text-gray-600">必要送金数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  ¥{Math.round(settlement.totalExpenses / settlement.totalMembers).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">1人あたり平均</div>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="flex justify-center">
            <Link
              href={`/wallets/${walletId}`}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ウォレットに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
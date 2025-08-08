'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SettlementTransaction, formatCurrency } from '@/lib/settlement'

interface SettlementProposalProps {
  walletId: string
  transactions: SettlementTransaction[]
  needsSettlement: boolean
  onSettlementComplete: () => void
}

export default function SettlementProposal({
  walletId,
  transactions,
  needsSettlement,
  onSettlementComplete
}: SettlementProposalProps) {
  const [completedTransactions, setCompletedTransactions] = useState<Set<number>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleTransactionComplete = (index: number) => {
    setCompletedTransactions(prev => new Set([...prev, index]))
  }

  const handleCompleteSettlement = async () => {
    if (completedTransactions.size !== transactions.length) {
      setError('すべての取引を完了してから精算を確定してください')
      return
    }

    setIsProcessing(true)
    setError('')
    
    try {
      const response = await fetch(`/api/wallets/${walletId}/settlement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: transactions.map(t => ({
            ...t,
            completed: true,
            completedAt: new Date().toISOString()
          }))
        }),
      })

      if (response.ok) {
        onSettlementComplete()
        setError('')
      } else {
        const errorData = await response.json()
        setError(errorData.error || '精算の記録に失敗しました')
      }
    } catch (error) {
      console.error('Settlement completion error:', error)
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!needsSettlement) {
    return (
      <div className="bg-green-50 rounded-lg p-8 text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          精算完了！
        </h3>
        <p className="text-green-700">
          すべてのメンバーの収支が均等になっています。
        </p>
      </div>
    )
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const allCompleted = completedTransactions.size === transactions.length

  return (
    <div className="space-y-6">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 精算サマリー */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">精算提案</h3>
        <div className="text-blue-800">
          <div className="text-sm mb-2">
            {transactions.length}回の送金で精算完了
          </div>
          <div className="text-2xl font-bold">
            総額 {formatCurrency(totalAmount)}
          </div>
        </div>
        {transactions.length > 0 && (
          <div className="mt-4 bg-blue-100 rounded p-3">
            <p className="text-xs text-blue-700">
              💡 この提案は最小回数での精算を目指しています。
              実際の送金方法はメンバー間で相談して決めてください。
            </p>
          </div>
        )}
      </div>

      {/* 精算取引一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">送金指示</h3>
          <p className="text-sm text-gray-700 mt-1">
            以下の送金を完了すると精算が完了します
          </p>
        </div>
        
        <div className="divide-y">
          {transactions.map((transaction, index) => {
            const isCompleted = completedTransactions.has(index)
            
            return (
              <div 
                key={index} 
                className={`p-6 transition-colors ${
                  isCompleted ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* 送金情報 */}
                  <div className="flex items-center space-x-4">
                    {/* From */}
                    <div className="flex items-center space-x-2">
                      {transaction.from.image && (
                        <Image
                          src={transaction.from.image}
                          alt={transaction.from.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium text-gray-900">
                        {transaction.from.name}
                      </span>
                    </div>
                    
                    {/* Arrow */}
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                    {/* To */}
                    <div className="flex items-center space-x-2">
                      {transaction.to.image && (
                        <Image
                          src={transaction.to.image}
                          alt={transaction.to.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium text-gray-900">
                        {transaction.to.name}
                      </span>
                    </div>
                  </div>

                  {/* 金額と完了ボタン */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleTransactionComplete(index)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isCompleted ? '完了' : '完了マーク'}
                    </button>
                  </div>
                </div>

                {isCompleted && (
                  <div className="mt-3 flex items-center text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    送金完了
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 精算確定ボタン */}
      {transactions.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleCompleteSettlement}
            disabled={!allCompleted || isProcessing}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              allCompleted && !isProcessing
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isProcessing ? '処理中...' : allCompleted ? '精算を確定する' : `残り${transactions.length - completedTransactions.size}件の送金を完了してください`}
          </button>
        </div>
      )}
    </div>
  )
}
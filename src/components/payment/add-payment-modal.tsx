'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { MemberForForm } from '@/types'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  walletId: string
  members: MemberForForm[]
  onPaymentAdded: () => void
}

interface PaymentParticipant {
  userId: string
  amount: number
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  walletId,
  members,
  onPaymentAdded
}: AddPaymentModalProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    payerId: session?.user?.id || ''
  })
  
  const [participants, setParticipants] = useState<PaymentParticipant[]>([])
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const categories = [
    '食事',
    '交通費',
    '宿泊',
    '娯楽',
    '買い物',
    'その他'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description.trim() || !formData.amount || selectedMembers.length === 0) {
      setError('必須項目を入力してください')
      return
    }

    const amount = parseFloat(formData.amount)
    if (amount <= 0) {
      setError('金額は正の値を入力してください')
      return
    }

    let finalParticipants: PaymentParticipant[]
    
    if (splitType === 'equal') {
      const splitAmount = Math.round(amount / selectedMembers.length)
      finalParticipants = selectedMembers.map(userId => ({
        userId,
        amount: splitAmount
      }))
    } else {
      const totalCustomAmount = participants.reduce((sum, p) => sum + p.amount, 0)
      if (Math.abs(totalCustomAmount - amount) > 0.01) {
        setError('参加者の合計金額が支払い総額と一致しません')
        return
      }
      finalParticipants = participants
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId,
          description: formData.description.trim(),
          amount,
          category: formData.category || null,
          payerId: formData.payerId,
          participants: finalParticipants
        }),
      })

      if (response.ok) {
        onPaymentAdded()
        onClose()
        resetForm()
      } else {
        const data = await response.json()
        setError(data.message || '支払いの追加に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      payerId: session?.user?.id || ''
    })
    setParticipants([])
    setSplitType('equal')
    setSelectedMembers([])
    setError('')
  }

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleCustomAmountChange = (userId: string, amount: number) => {
    setParticipants(prev => {
      const existing = prev.find(p => p.userId === userId)
      if (existing) {
        return prev.map(p => p.userId === userId ? { ...p, amount } : p)
      } else {
        return [...prev, { userId, amount }]
      }
    })
  }

  const getParticipantAmount = (userId: string): number => {
    if (splitType === 'equal') {
      const amount = parseFloat(formData.amount) || 0
      return selectedMembers.length > 0 ? Math.round(amount / selectedMembers.length) : 0
    } else {
      return participants.find(p => p.userId === userId)?.amount || 0
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">支払いを追加</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                支払い内容 *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="例: ランチ代"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                金額 *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                min="0"
                step="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選択してください</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Payer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                支払者 *
              </label>
              <select
                value={formData.payerId}
                onChange={(e) => setFormData(prev => ({ ...prev, payerId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {members.map(member => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Split Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                分割方法
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="equal"
                    checked={splitType === 'equal'}
                    onChange={(e) => setSplitType(e.target.value as 'equal')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-800">均等割り</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={splitType === 'custom'}
                    onChange={(e) => setSplitType(e.target.value as 'custom')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-800">カスタム分割</span>
                </label>
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                参加者 *
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {members.map(member => {
                  const isSelected = selectedMembers.includes(member.user.id)
                  return (
                    <div key={member.user.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <label className="flex items-center cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMemberToggle(member.user.id)}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-800">{member.user.name}</span>
                      </label>
                      
                      {isSelected && (
                        <div className="ml-3">
                          {splitType === 'equal' ? (
                            <span className="text-sm text-gray-700">
                              ¥{getParticipantAmount(member.user.id).toLocaleString()}
                            </span>
                          ) : (
                            <input
                              type="number"
                              value={getParticipantAmount(member.user.id)}
                              onChange={(e) => handleCustomAmountChange(member.user.id, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              min="0"
                              step="1"
                              className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {splitType === 'custom' && selectedMembers.length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span>合計:</span>
                    <span>¥{participants.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>支払い総額:</span>
                    <span>¥{parseFloat(formData.amount || '0').toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading || selectedMembers.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '追加中...' : '支払いを追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
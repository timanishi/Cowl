'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet } from '@/types'

interface WalletSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  wallet: Wallet | null
  currentUserId: string
  onWalletUpdated: () => void
}

export default function WalletSettingsModal({
  isOpen,
  onClose,
  wallet,
  currentUserId,
  onWalletUpdated
}: WalletSettingsModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Initialize form data when wallet changes
  useEffect(() => {
    if (wallet && isOpen) {
      setFormData({
        name: wallet.name,
        description: wallet.description || ''
      })
      setError('')
      setShowDeleteConfirm(false)
    }
  }, [wallet, isOpen])

  // Check if current user is owner
  const isOwner = wallet?.members.find(m => m.user.id === currentUserId)?.role === 'owner'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!wallet || !formData.name.trim()) {
      setError('ウォレット名は必須です')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/wallets/${wallet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim()
        }),
      })

      if (response.ok) {
        onWalletUpdated()
        onClose()
      } else {
        const data = await response.json()
        setError(data.error || 'ウォレットの更新に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!wallet) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/wallets/${wallet.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'ウォレットの削除に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!isOpen || !wallet) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">ウォレット設定</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isOwner && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                オーナーのみがウォレットの設定を変更できます。
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!showDeleteConfirm ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Wallet Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ウォレット名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例: 箱根旅行"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isOwner || loading}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明（任意）
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="このウォレットについて詳細を入力..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isOwner || loading}
                  />
                </div>

                {/* Member Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メンバー数
                  </label>
                  <div className="text-gray-700">
                    {wallet.members.length}人のメンバー
                  </div>
                </div>

                {/* Invite Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    招待コード
                  </label>
                  <div className="text-gray-700 text-sm">
                    招待コードは変更できません。新しいメンバーを招待するには、
                    ウォレット詳細ページから招待リンクを共有してください。
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={loading}
                  >
                    キャンセル
                  </button>
                  {isOwner && (
                    <button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? '更新中...' : '更新'}
                    </button>
                  )}
                </div>
              </form>

              {/* Delete Section */}
              {isOwner && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">危険な操作</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    ウォレットを削除すると、すべての支払い記録と精算履歴が永久に削除されます。
                    この操作は元に戻せません。
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    ウォレットを削除
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Delete Confirmation */
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 14.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">本当に削除しますか？</h3>
              <p className="text-sm text-gray-700 mb-6">
                「{wallet.name}」を削除します。この操作は元に戻せません。
                すべての支払い記録と精算履歴が永久に削除されます。
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '削除中...' : '削除する'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
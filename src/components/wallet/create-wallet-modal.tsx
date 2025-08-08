'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateWalletModal({ isOpen, onClose, onSuccess }: CreateWalletModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const wallet = await response.json()
        setFormData({ name: '', description: '' })
        onClose()
        if (onSuccess) {
          onSuccess()
        }
        // ウォレット詳細ページに遷移
        router.push(`/wallets/${wallet.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'ウォレットの作成に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              新しいウォレットを作成
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                ウォレット名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 沖縄旅行, 忘年会"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明（任意）
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="このウォレットの用途や期間について"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '作成中...' : 'ウォレットを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
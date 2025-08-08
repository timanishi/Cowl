'use client'

import { useState } from 'react'
import { safeUserName, safeUserImage } from '@/types'

interface SettlementRecordProps {
  record: {
    id: string
    amount: number
    isCompleted: boolean
    completedAt: string | null
    createdAt: string
    fromUser: {
      id: string
      name: string | null
      image: string | null
    }
    toUser: {
      id: string
      name: string | null
      image: string | null
    }
  }
  onStatusChange: () => void
}

export default function SettlementRecord({ record, onStatusChange }: SettlementRecordProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async () => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/settlements/${record.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted: !record.isCompleted,
        }),
      })

      if (response.ok) {
        onStatusChange()
      } else {
        alert('ステータス更新に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この精算記録を削除しますか？')) {
      return
    }

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/settlements/${record.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onStatusChange()
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      record.isCompleted 
        ? 'bg-green-50 border-green-200' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center space-x-4 flex-1">
        {/* From User */}
        <div className="flex items-center space-x-2">
          <img
            src={safeUserImage(record.fromUser)}
            alt={safeUserName(record.fromUser)}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-900">
            {safeUserName(record.fromUser)}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* To User */}
        <div className="flex items-center space-x-2">
          <img
            src={safeUserImage(record.toUser)}
            alt={safeUserName(record.toUser)}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-900">
            {safeUserName(record.toUser)}
          </span>
        </div>

        {/* Amount */}
        <div className="flex-shrink-0">
          <span className="text-lg font-bold text-gray-900">
            ¥{record.amount.toLocaleString()}
          </span>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          {record.isCompleted ? (
            <div className="flex items-center space-x-1 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">完了</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-orange-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">未完了</span>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="flex-shrink-0 text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString('ja-JP')}
          {record.completedAt && (
            <div className="text-xs text-green-600">
              完了: {new Date(record.completedAt).toLocaleDateString('ja-JP')}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleStatusToggle}
          disabled={isUpdating}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            record.isCompleted
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? '更新中...' : record.isCompleted ? '未完了にする' : '完了にする'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          削除
        </button>
      </div>
    </div>
  )
}
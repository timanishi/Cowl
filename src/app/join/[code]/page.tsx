'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '@/components/ui/footer'

interface WalletInfo {
  id: string
  name: string
  description?: string
  members: {
    user: {
      name: string
      image?: string
    }
  }[]
}

export default function JoinWalletPage({ params }: { params: Promise<{ code: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [inviteCode, setInviteCode] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setInviteCode(resolvedParams.code)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (inviteCode) {
      fetchWalletInfo()
    }
  }, [inviteCode])

  const fetchWalletInfo = async () => {
    try {
      const response = await fetch(`/api/wallets/join/${inviteCode}`)
      
      if (response.ok) {
        const data = await response.json()
        setWallet(data)
      } else if (response.status === 404) {
        setError('招待コードが無効です')
      } else {
        setError('ウォレット情報の取得に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinWallet = async () => {
    if (!session) {
      // 未ログインの場合はサインインページへ
      signIn('google', { 
        callbackUrl: `/join/${inviteCode}` 
      })
      return
    }

    setJoining(true)
    setError('')

    try {
      const response = await fetch(`/api/wallets/join/${inviteCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/wallets/${data.walletId}`)
      } else if (response.status === 409) {
        setError('既にこのウォレットのメンバーです')
      } else if (response.status === 404) {
        setError('招待コードが無効です')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'ウォレットへの参加に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ウォレット情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">エラー</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!wallet) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ウォレットに招待されました
            </h1>
            <p className="text-gray-600">
              以下のウォレットに参加しませんか？
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {wallet.name}
            </h2>
            {wallet.description && (
              <p className="text-gray-600 mb-4">{wallet.description}</p>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">メンバー:</span>
              <div className="flex -space-x-2">
                {wallet.members.slice(0, 5).map((member, index) => (
                  <div key={index} className="relative">
                    {member.user.image ? (
                      <Image
                        src={member.user.image}
                        alt={member.user.name}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                ))}
                {wallet.members.length > 5 && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{wallet.members.length - 5}</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {wallet.members.length}人
              </span>
            </div>
          </div>

          {!session ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                ウォレットに参加するにはログインが必要です
              </p>
              <button
                onClick={handleJoinWallet}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                Googleでログインして参加
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-sm text-gray-600">としてログイン中</p>
                </div>
              </div>
              
              <button
                onClick={handleJoinWallet}
                disabled={joining}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? '参加中...' : 'ウォレットに参加する'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
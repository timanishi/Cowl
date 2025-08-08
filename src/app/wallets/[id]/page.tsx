'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AddPaymentModal from '@/components/payment/add-payment-modal'
import EditPaymentModal from '@/components/payment/edit-payment-modal'
import WalletSettingsModal from '@/components/wallet/wallet-settings-modal'
import { 
  Wallet, 
  PaymentForForm, 
  MemberForForm, 
  convertMemberForForm, 
  convertPaymentForForm, 
  safeUserName, 
  safeUserImage 
} from '@/types'

export default function WalletDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [walletId, setWalletId] = useState<string>('')
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showEditPayment, setShowEditPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentForForm | null>(null)
  const [showWalletSettings, setShowWalletSettings] = useState(false)

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
      fetchWallet()
    }
  }, [session, status, router, walletId])

  const fetchWallet = async () => {
    try {
      const response = await fetch(`/api/wallets/${walletId}`)
      if (response.ok) {
        const data = await response.json()
        setWallet(data)
      } else if (response.status === 404) {
        setError('ウォレットが見つかりません')
      } else if (response.status === 403) {
        setError('このウォレットにアクセスする権限がありません')
      } else {
        setError('ウォレットの読み込みに失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${wallet?.inviteCode}`
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('招待リンクをコピーしました！')
    })
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const handleEditPayment = (payment: PaymentForForm) => {
    setSelectedPayment(payment)
    setShowEditPayment(true)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
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

  if (!wallet) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{wallet.name}</h1>
              {wallet.description && (
                <p className="text-sm text-gray-600">{wallet.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowWalletSettings(true)}
              className="text-gray-500 hover:text-gray-700 p-2"
              title="ウォレット設定"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Wallet Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ウォレット情報</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">メンバー数</span>
                  <span className="font-medium">{wallet.members.length}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">支払い件数</span>
                  <span className="font-medium">{wallet.payments?.length || 0}件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">作成日</span>
                  <span className="font-medium text-sm">{formatDate(wallet.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">メンバー</h3>
                <button
                  onClick={() => setShowInviteCode(!showInviteCode)}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  招待
                </button>
              </div>
              
              {showInviteCode && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">招待コード:</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                      {wallet.inviteCode}
                    </code>
                    <button
                      onClick={copyInviteLink}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      リンクをコピー
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {wallet.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    {member.user.image && (
                      <Image
                        src={member.user.image}
                        alt={member.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{safeUserName(member.user)}</p>
                      {member.role === 'owner' && (
                        <p className="text-xs text-blue-600">オーナー</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">支払い履歴</h3>
                  <div className="flex space-x-3">
                    {(wallet.payments?.length || 0) > 0 && (
                      <Link
                        href={`/wallets/${walletId}/settlement`}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                      >
                        精算計算
                      </Link>
                    )}
                    <button 
                      onClick={() => setShowAddPayment(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                    >
                      支払いを追加
                    </button>
                  </div>
                </div>
              </div>

              {(wallet.payments?.length || 0) === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">支払いがありません</h4>
                  <p className="text-gray-600 mb-4">最初の支払いを記録しましょう</p>
                  <button 
                    onClick={() => setShowAddPayment(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    支払いを追加
                  </button>
                </div>
              ) : (
                <div className="divide-y">
                  {wallet.payments?.map((payment) => {
                    const paymentForForm = convertPaymentForForm(payment)
                    return (
                      <div key={payment.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {safeUserImage(payment.payer) && (
                              <Image
                                src={safeUserImage(payment.payer)!}
                                alt={safeUserName(payment.payer)}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{payment.description}</h4>
                              <p className="text-sm text-gray-600">
                                {safeUserName(payment.payer)}が支払い
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(payment.createdAt)}
                              </p>
                              <div className="mt-2 text-xs text-gray-500">
                                参加者: {payment.participants.map(p => safeUserName(p.user)).join(', ')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-start space-x-3">
                            <div>
                              <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                              {payment.category && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {payment.category}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleEditPayment(paymentForForm)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="編集"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Payment Modal */}
      {wallet && (
        <AddPaymentModal
          isOpen={showAddPayment}
          onClose={() => setShowAddPayment(false)}
          walletId={walletId}
          members={wallet.members.map(convertMemberForForm)}
          onPaymentAdded={() => {
            setShowAddPayment(false)
            fetchWallet() // Refresh wallet data
          }}
        />
      )}

      {/* Edit Payment Modal */}
      {wallet && (
        <EditPaymentModal
          isOpen={showEditPayment}
          onClose={() => {
            setShowEditPayment(false)
            setSelectedPayment(null)
          }}
          payment={selectedPayment}
          members={wallet.members.map(convertMemberForForm)}
          onPaymentUpdated={() => {
            setShowEditPayment(false)
            setSelectedPayment(null)
            fetchWallet() // Refresh wallet data
          }}
        />
      )}

      {/* Wallet Settings Modal */}
      {wallet && session?.user?.id && (
        <WalletSettingsModal
          isOpen={showWalletSettings}
          onClose={() => setShowWalletSettings(false)}
          wallet={wallet}
          currentUserId={session.user.id}
          onWalletUpdated={() => {
            setShowWalletSettings(false)
            fetchWallet() // Refresh wallet data
          }}
        />
      )}
    </div>
  )
}
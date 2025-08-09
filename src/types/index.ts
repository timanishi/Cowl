// 共通型定義ファイル

export interface User {
  id: string
  name: string | null
  email?: string | null
  image?: string | null
}

export interface WalletMember {
  id: string
  role: string
  joinedAt: string | Date
  user: User
}

export interface PaymentParticipant {
  id: string
  userId: string
  amount: number
  user: User
}

export interface Payment {
  id: string
  amount: number
  description: string | null
  category?: string | null
  payerId: string
  createdAt: string | Date
  payer: User
  participants: PaymentParticipant[]
}

export interface Wallet {
  id: string
  name: string
  description?: string | null
  inviteCode: string
  createdAt: string | Date
  updatedAt: string | Date
  isActive: boolean
  members: WalletMember[]
  payments?: Payment[]
}

// フォームで使用する簡略化された型
export interface MemberForForm {
  id: string
  role: string
  user: {
    id: string
    name: string
    image?: string
  }
}

export interface PaymentForForm {
  id: string
  amount: number
  description: string | null
  category?: string
  payerId: string
  payer: {
    id: string
    name: string
    image?: string
  }
  participants: {
    id: string
    userId: string
    amount: number
    user: {
      id: string
      name: string
      image?: string
    }
  }[]
}

// ヘルパー関数
export function safeUserName(user: User | { name: string | null }): string {
  return user.name || 'Unknown User'
}

export function safeUserImage(user: User | { image?: string | null }): string | undefined {
  return user.image || undefined
}

export function convertMemberForForm(member: WalletMember): MemberForForm {
  return {
    id: member.id,
    role: member.role,
    user: {
      id: member.user.id,
      name: safeUserName(member.user),
      image: safeUserImage(member.user)
    }
  }
}

export function convertPaymentForForm(payment: Payment): PaymentForForm {
  return {
    id: payment.id,
    amount: payment.amount,
    description: payment.description,
    category: payment.category || undefined,
    payerId: payment.payerId,
    payer: {
      id: payment.payer.id,
      name: safeUserName(payment.payer),
      image: safeUserImage(payment.payer)
    },
    participants: payment.participants.map(p => ({
      id: p.id,
      userId: p.userId,
      amount: p.amount,
      user: {
        id: p.user.id,
        name: safeUserName(p.user),
        image: safeUserImage(p.user)
      }
    }))
  }
}
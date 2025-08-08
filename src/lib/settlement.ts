// 精算計算のためのユーティリティ関数

export interface MemberBalance {
  userId: string
  name: string
  image?: string
  totalPaid: number      // 支払った総額
  totalOwed: number      // 負担すべき総額
  balance: number        // 収支バランス（正の値：受け取る、負の値：支払う）
}

export interface Payment {
  id: string
  amount: number
  description: string
  category?: string | null
  createdAt: string | Date
  payer: {
    id: string
    name: string | null
    image?: string | null
  }
  participants: {
    userId: string
    amount: number
    user: {
      id: string
      name: string | null
      image?: string | null
    }
  }[]
}

export interface SettlementTransaction {
  from: {
    userId: string
    name: string
    image?: string
  }
  to: {
    userId: string
    name: string
    image?: string
  }
  amount: number
}

export interface WalletWithPayments {
  id: string
  name: string
  members: {
    user: {
      id: string
      name: string | null
      image?: string | null
    }
  }[]
  payments: Payment[]
}

/**
 * ウォレットの各メンバーの収支を計算する
 */
export function calculateMemberBalances(wallet: WalletWithPayments): MemberBalance[] {
  const memberBalances = new Map<string, MemberBalance>()
  
  // 全メンバーを初期化
  wallet.members.forEach(member => {
    memberBalances.set(member.user.id, {
      userId: member.user.id,
      name: member.user.name || 'Unknown User',
      image: member.user.image || undefined,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0
    })
  })
  
  // 各支払いを処理
  wallet.payments.forEach(payment => {
    // 支払者の支払い額を加算
    const payer = memberBalances.get(payment.payer.id)
    if (payer) {
      payer.totalPaid += payment.amount
    }
    
    // 参加者の負担額を加算
    payment.participants.forEach(participant => {
      const member = memberBalances.get(participant.userId)
      if (member) {
        member.totalOwed += participant.amount
      }
    })
  })
  
  // 収支バランスを計算（支払った額 - 負担すべき額）
  memberBalances.forEach(member => {
    member.balance = member.totalPaid - member.totalOwed
  })
  
  return Array.from(memberBalances.values())
}

/**
 * 最小回数での精算案を計算する（貪欲法による近似解）
 */
export function calculateOptimalSettlement(balances: MemberBalance[]): SettlementTransaction[] {
  const transactions: SettlementTransaction[] = []
  
  // 債権者（正の残高）と債務者（負の残高）を分離
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance)
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance)
  
  let i = 0, j = 0
  
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    
    // 取引額を決定（債権額と債務額の小さい方）
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance))
    
    if (amount > 0.01) { // 1円未満は無視
      transactions.push({
        from: {
          userId: debtor.userId,
          name: debtor.name,
          image: debtor.image
        },
        to: {
          userId: creditor.userId,
          name: creditor.name,
          image: creditor.image
        },
        amount: Math.round(amount)
      })
    }
    
    // 残高を更新
    creditor.balance -= amount
    debtor.balance += amount
    
    // 残高が0になった方を次に進める
    if (Math.abs(creditor.balance) < 0.01) i++
    if (Math.abs(debtor.balance) < 0.01) j++
  }
  
  return transactions
}

/**
 * ウォレットの精算状況を取得する
 */
export function getSettlementStatus(wallet: WalletWithPayments) {
  const memberBalances = calculateMemberBalances(wallet)
  const settlementTransactions = calculateOptimalSettlement(memberBalances)
  
  // 精算が必要かどうか
  const needsSettlement = settlementTransactions.length > 0
  
  // 総支払い額
  const totalExpenses = wallet.payments.reduce((sum, payment) => sum + payment.amount, 0)
  
  // 各メンバーの統計
  const memberStats = memberBalances.map(balance => ({
    ...balance,
    participationCount: wallet.payments.filter(p => 
      p.participants.some(part => part.userId === balance.userId)
    ).length,
    paymentCount: wallet.payments.filter(p => p.payer.id === balance.userId).length
  }))
  
  return {
    memberBalances: memberStats,
    settlementTransactions,
    needsSettlement,
    totalExpenses,
    totalMembers: wallet.members.length,
    totalPayments: wallet.payments.length
  }
}

/**
 * 精算額をフォーマットする
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount)
}

/**
 * 精算状況のサマリーテキストを生成
 */
export function getSettlementSummary(status: ReturnType<typeof getSettlementStatus>): string {
  if (!status.needsSettlement) {
    return "精算は完了しています！"
  }
  
  const transactionCount = status.settlementTransactions.length
  const totalAmount = status.settlementTransactions.reduce((sum, t) => sum + t.amount, 0)
  
  return `${transactionCount}回の送金で精算完了（総額：${formatCurrency(totalAmount)}）`
}
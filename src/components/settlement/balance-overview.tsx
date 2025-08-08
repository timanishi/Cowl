'use client'

import Image from 'next/image'
import { MemberBalance, formatCurrency } from '@/lib/settlement'

interface BalanceOverviewProps {
  memberBalances: (MemberBalance & {
    participationCount: number
    paymentCount: number
  })[]
  totalExpenses: number
}

export default function BalanceOverview({ memberBalances, totalExpenses }: BalanceOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 総支出額 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">ウォレット総支出</h3>
        <div className="text-3xl font-bold text-indigo-600">
          {formatCurrency(totalExpenses)}
        </div>
        <p className="text-sm text-gray-700 mt-2">
          {memberBalances.length}人で分担
        </p>
      </div>

      {/* 各メンバーの収支状況 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">メンバー別収支</h3>
          <p className="text-sm text-gray-700 mt-1">
            各メンバーの支払い状況と収支バランス
          </p>
        </div>
        
        <div className="divide-y">
          {memberBalances
            .sort((a, b) => b.balance - a.balance) // 収支順でソート
            .map((member) => (
              <div key={member.userId} className="p-6">
                <div className="flex items-center justify-between">
                  {/* メンバー情報 */}
                  <div className="flex items-center space-x-3">
                    {member.image && (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-xs text-gray-600">
                        {member.paymentCount}回支払い・{member.participationCount}回参加
                      </p>
                    </div>
                  </div>

                  {/* 収支情報 */}
                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        支払い: {formatCurrency(member.totalPaid)}
                      </div>
                      <div className="text-xs text-gray-600">
                        負担: {formatCurrency(member.totalOwed)}
                      </div>
                      <div className={`font-semibold ${
                        member.balance > 0.01 
                          ? 'text-green-600' 
                          : member.balance < -0.01 
                            ? 'text-red-600' 
                            : 'text-gray-700'
                      }`}>
                        {member.balance > 0.01 
                          ? `+${formatCurrency(member.balance)}` 
                          : member.balance < -0.01 
                            ? formatCurrency(member.balance)
                            : '精算済'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* バランスバー */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-700 mb-2">
                    <span>支払い過多</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          member.balance > 0 
                            ? 'bg-green-500' 
                            : member.balance < 0 
                              ? 'bg-red-500' 
                              : 'bg-gray-400'
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(member.balance) / Math.max(...memberBalances.map(m => Math.abs(m.balance))) * 100, 100)}%`,
                          marginLeft: member.balance < 0 ? `${100 - Math.min(Math.abs(member.balance) / Math.max(...memberBalances.map(m => Math.abs(m.balance))) * 100, 100)}%` : '0%'
                        }}
                      />
                    </div>
                    <span>支払い不足</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* 収支サマリー */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {memberBalances.filter(m => m.balance > 0.01).length}
          </div>
          <div className="text-sm text-green-700">受取人</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {memberBalances.filter(m => m.balance < -0.01).length}
          </div>
          <div className="text-sm text-red-700">支払人</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">
            {memberBalances.filter(m => Math.abs(m.balance) <= 0.01).length}
          </div>
          <div className="text-sm text-gray-700">精算済</div>
        </div>
      </div>
    </div>
  )
}
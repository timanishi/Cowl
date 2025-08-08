import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSettlementStatus } from '@/lib/settlement'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // ウォレットと関連データを取得
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        payments: {
          include: {
            payer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            participants: {
              select: {
                userId: true,
                amount: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // 精算状況を計算
    const settlementStatus = getSettlementStatus(wallet)

    // 既存の精算記録を取得 (TODO: Enable after migration)
    // const existingSettlements = await prisma.settlement.findMany({
    //   where: { walletId: id },
    //   include: {
    //     fromUser: {
    //       select: { id: true, name: true, image: true }
    //     },
    //     toUser: {
    //       select: { id: true, name: true, image: true }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // })
    const existingSettlements: any[] = [] // Placeholder

    return NextResponse.json({
      walletId: wallet.id,
      walletName: wallet.name,
      ...settlementStatus,
      existingSettlements,
      calculatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error calculating settlement:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { transactions } = await request.json()

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: 'Invalid transactions data' }, { status: 400 })
    }

    // ウォレットのアクセス権限をチェック
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found or access denied' }, { status: 404 })
    }

    // 精算記録をデータベースに保存 (TODO: Enable after migration)
    // const settlements = await Promise.all(
    //   transactions.map(async (transaction: any) => {
    //     return await prisma.settlement.create({
    //       data: {
    //         walletId: id,
    //         fromUserId: transaction.from.id,
    //         toUserId: transaction.to.id,
    //         amount: transaction.amount,
    //         isCompleted: false, // 初期状態は未完了
    //       },
    //       include: {
    //         fromUser: {
    //           select: { id: true, name: true, image: true }
    //         },
    //         toUser: {
    //           select: { id: true, name: true, image: true }
    //         }
    //       }
    //     })
    //   })
    // )

    // 一時的にレスポンスをシンプルに
    return NextResponse.json({
      success: true,
      message: '精算が記録されました（一時的な実装）'
    })
  } catch (error) {
    console.error('Error recording settlement:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
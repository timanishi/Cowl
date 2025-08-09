import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      walletId,
      description,
      amount,
      category,
      payerId,
      participants
    } = await request.json()

    if (!walletId || !amount || !payerId || !participants || participants.length === 0) {
      return NextResponse.json(
        { message: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: '金額は正の値を入力してください' },
        { status: 400 }
      )
    }

    // Check if user is a member of the wallet
    const walletMember = await prisma.walletMember.findFirst({
      where: {
        walletId,
        userId: session.user.id
      }
    })

    if (!walletMember) {
      return NextResponse.json(
        { message: 'このウォレットにアクセスする権限がありません' },
        { status: 403 }
      )
    }

    // Verify that payer is a member of the wallet
    const payerMember = await prisma.walletMember.findFirst({
      where: {
        walletId,
        userId: payerId
      }
    })

    if (!payerMember) {
      return NextResponse.json(
        { message: '指定された支払者はウォレットのメンバーではありません' },
        { status: 400 }
      )
    }

    // Verify that all participants are members of the wallet
    const participantUserIds = participants.map((p: any) => p.userId)
    const validParticipants = await prisma.walletMember.findMany({
      where: {
        walletId,
        userId: { in: participantUserIds }
      }
    })

    if (validParticipants.length !== participantUserIds.length) {
      return NextResponse.json(
        { message: '指定された参加者の中にウォレットのメンバーでない人がいます' },
        { status: 400 }
      )
    }

    // Validate participants amounts
    const totalParticipantAmount = participants.reduce((sum: number, p: any) => sum + p.amount, 0)
    if (Math.abs(totalParticipantAmount - amount) > 0.01) {
      return NextResponse.json(
        { message: '参加者の合計金額が支払い総額と一致しません' },
        { status: 400 }
      )
    }

    // Create payment with participants in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          walletId,
          description: description || '',
          amount,
          category: category || null,
          payerId,
          participants: {
            create: participants.map((p: any) => ({
              userId: p.userId,
              amount: p.amount
            }))
          }
        },
        include: {
          payer: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          participants: {
            select: {
              userId: true,
              amount: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      })

      return newPayment
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const walletId = searchParams.get('walletId')

    if (!walletId) {
      return NextResponse.json(
        { message: 'walletId is required' },
        { status: 400 }
      )
    }

    // Check if user is a member of the wallet
    const walletMember = await prisma.walletMember.findFirst({
      where: {
        walletId,
        userId: session.user.id
      }
    })

    if (!walletMember) {
      return NextResponse.json(
        { message: 'このウォレットにアクセスする権限がありません' },
        { status: 403 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: { walletId },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        participants: {
          select: {
            userId: true,
            amount: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
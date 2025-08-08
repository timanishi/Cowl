import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, description, category, participantIds } = await request.json()
    const { id } = await params

    // ウォレットメンバーかどうか確認
    const walletMember = await prisma.walletMember.findUnique({
      where: {
        userId_walletId: {
          userId: session.user.id,
          walletId: id,
        },
      },
    })

    if (!walletMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // 参加者の人数で金額を分割
    const amountPerPerson = Math.floor(amount / participantIds.length)

    const payment = await prisma.payment.create({
      data: {
        walletId: id,
        payerId: session.user.id,
        amount,
        description,
        category,
        participants: {
          create: participantIds.map((userId: string) => ({
            userId,
            amount: amountPerPerson,
          })),
        },
      },
      include: {
        payer: true,
        participants: {
          include: {
            payment: true,
          },
        },
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const wallet = await prisma.wallet.findUnique({
      where: {
        inviteCode: code,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        members: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    return NextResponse.json(wallet)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await params

    // ウォレットを検索
    const wallet = await prisma.wallet.findUnique({
      where: {
        inviteCode: code,
        isActive: true,
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // 既にメンバーかどうか確認
    if (wallet.members.length > 0) {
      return NextResponse.json({ error: 'Already a member' }, { status: 409 })
    }

    // メンバーとして追加
    const walletMember = await prisma.walletMember.create({
      data: {
        userId: session.user.id,
        walletId: wallet.id,
        role: 'member',
      },
    })

    return NextResponse.json({ 
      walletId: wallet.id,
      message: 'Successfully joined wallet' 
    }, { status: 201 })
  } catch (error) {
    console.error('Join wallet error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
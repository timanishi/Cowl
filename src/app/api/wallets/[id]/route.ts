import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
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
            user: true,
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

    return NextResponse.json(wallet)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    // Validate input
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Wallet name is required' }, { status: 400 })
    }

    // Check if wallet exists and user is owner
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: session.user.id,
            role: 'owner'
          }
        }
      }
    })

    if (!wallet) {
      return NextResponse.json({ 
        error: 'Wallet not found or you do not have permission to edit' 
      }, { status: 404 })
    }

    // Update wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        updatedAt: new Date()
      },
      include: {
        members: {
          include: {
            user: true,
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

    return NextResponse.json(updatedWallet)
  } catch (error) {
    console.error('Error updating wallet:', error)
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if wallet exists and user is owner
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: session.user.id,
            role: 'owner'
          }
        }
      },
      include: {
        payments: true
        // settlements: true  // TODO: Enable after migration
      }
    })

    if (!wallet) {
      return NextResponse.json({ 
        error: 'Wallet not found or you do not have permission to delete' 
      }, { status: 404 })
    }

    // Check if there are unsettled payments
    if (wallet.payments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete wallet with existing payments. Please settle all expenses first.' 
      }, { status: 400 })
    }

    // Delete wallet (cascade will handle related records)
    await prisma.wallet.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wallet:', error)
    return NextResponse.json(
      { error: 'Failed to delete wallet' },
      { status: 500 }
    )
  }
}
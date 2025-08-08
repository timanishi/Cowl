import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: settlementId } = await params
    const body = await request.json()
    const { isCompleted } = body

    if (typeof isCompleted !== 'boolean') {
      return NextResponse.json({ error: 'isCompleted must be a boolean' }, { status: 400 })
    }

    try {
      // Check if settlement exists and user has permission
      const settlement = await prisma.settlement.findFirst({
        where: {
          id: settlementId,
          wallet: {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      })

      if (!settlement) {
        return NextResponse.json({ error: 'Settlement not found or no permission' }, { status: 404 })
      }

      // Update settlement status
      const updatedSettlement = await prisma.settlement.update({
        where: { id: settlementId },
        data: {
          isCompleted,
          completedAt: isCompleted ? new Date() : null
        },
        include: {
          fromUser: {
            select: { id: true, name: true, image: true }
          },
          toUser: {
            select: { id: true, name: true, image: true }
          }
        }
      })

      return NextResponse.json(updatedSettlement)
    } catch (error) {
      console.error('Settlement update error:', error)
      return NextResponse.json({ error: 'Settlement functionality not available yet' }, { status: 503 })
    }
  } catch (error) {
    console.error('Error updating settlement:', error)
    return NextResponse.json(
      { error: 'Failed to update settlement' },
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

    const { id: settlementId } = await params

    try {
      // Check if settlement exists and user has permission
      const settlement = await prisma.settlement.findFirst({
        where: {
          id: settlementId,
          wallet: {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      })

      if (!settlement) {
        return NextResponse.json({ error: 'Settlement not found or no permission' }, { status: 404 })
      }

      // Delete settlement
      await prisma.settlement.delete({
        where: { id: settlementId }
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Settlement deletion error:', error)
      return NextResponse.json({ error: 'Settlement functionality not available yet' }, { status: 503 })
    }
  } catch (error) {
    console.error('Error deleting settlement:', error)
    return NextResponse.json(
      { error: 'Failed to delete settlement' },
      { status: 500 }
    )
  }
}
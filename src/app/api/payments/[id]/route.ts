import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: paymentId } = await params;
    const body = await request.json();
    const { amount, description, category, participants } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 });
    }

    // Validate that total participant amounts equal payment amount
    const totalParticipantAmount = participants.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    if (totalParticipantAmount !== amount) {
      return NextResponse.json({ 
        error: 'Total participant amounts must equal payment amount' 
      }, { status: 400 });
    }

    // Check if payment exists and user has permission to edit
    const existingPayment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        wallet: {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      include: {
        wallet: {
          include: {
            members: true
          }
        },
        participants: true
      }
    });

    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment not found or no permission' }, { status: 404 });
    }

    // Validate that all participants are members of the wallet
    const walletMemberIds = existingPayment.wallet.members.map(m => m.userId);
    for (const participant of participants) {
      if (!walletMemberIds.includes(participant.userId)) {
        return NextResponse.json({ 
          error: 'All participants must be wallet members' 
        }, { status: 400 });
      }
    }

    // Update payment in transaction
    const updatedPayment = await prisma.$transaction(async (tx) => {
      // Delete existing participants
      await tx.paymentParticipant.deleteMany({
        where: { paymentId }
      });

      // Update payment
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          amount,
          description: description.trim(),
          category: category || null,
          updatedAt: new Date()
        },
        include: {
          payer: true,
          participants: {
            include: {
              user: true
            }
          }
        }
      });

      // Create new participants
      await tx.paymentParticipant.createMany({
        data: participants.map((p: any) => ({
          paymentId,
          userId: p.userId,
          amount: p.amount
        }))
      });

      // Return updated payment with participants
      return await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          payer: true,
          participants: {
            include: {
              user: true
            }
          }
        }
      });
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: paymentId } = await params;

    // Check if payment exists and user has permission to delete
    const existingPayment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        wallet: {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      }
    });

    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment not found or no permission' }, { status: 404 });
    }

    // Delete payment (participants will be deleted automatically due to CASCADE)
    await prisma.payment.delete({
      where: { id: paymentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: paymentId } = await params;

    // Get payment with details
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        wallet: {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      include: {
        payer: true,
        participants: {
          include: {
            user: true
          }
        },
        wallet: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found or no permission' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}
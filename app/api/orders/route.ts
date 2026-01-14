import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const orders = db.orders.findAll();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, orderDetails, amount } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = db.orders.create({
      customerName,
      customerEmail,
      customerPhone,
      orderDetails: orderDetails || '',
      amount: amount || 0,
      orderDate: new Date(),
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    db.orders.deleteAll();
    return NextResponse.json({ success: true, message: 'All orders deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete orders' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { sendEmail, generateReminderEmail } from '@/lib/email';
import { sendWhatsApp, generateReminderWhatsApp } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = db.orders.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Send Email
    const emailTemplate = generateReminderEmail(order.customerName, order.id);
    emailTemplate.to = order.customerEmail;
    const emailSent = await sendEmail(emailTemplate);

    // Send WhatsApp
    const whatsappMessage = generateReminderWhatsApp(order.customerName, order.id);
    const whatsappSent = await sendWhatsApp({
      to: order.customerPhone,
      body: whatsappMessage,
    });

    if (emailSent || whatsappSent) {
      db.orders.markReminderSent(order.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder sent',
      emailSent,
      whatsappSent,
    });
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}

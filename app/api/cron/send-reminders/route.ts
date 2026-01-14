import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { sendEmail, generateReminderEmail } from '@/lib/email';
import { sendWhatsApp, generateReminderWhatsApp } from '@/lib/whatsapp';

export async function GET() {
  try {
    const ordersNeedingReminder = db.orders.findOrdersNeedingReminder();

    if (ordersNeedingReminder.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orders need reminders',
        count: 0,
      });
    }

    const results = {
      processed: 0,
      emailsSent: 0,
      whatsappSent: 0,
      failed: 0,
    };

    for (const order of ordersNeedingReminder) {
      results.processed++;

      // Send Email
      const emailTemplate = generateReminderEmail(order.customerName, order.id);
      emailTemplate.to = order.customerEmail;
      const emailSent = await sendEmail(emailTemplate);
      if (emailSent) results.emailsSent++;

      // Send WhatsApp
      const whatsappMessage = generateReminderWhatsApp(order.customerName, order.id);
      const whatsappSent = await sendWhatsApp({
        to: order.customerPhone,
        body: whatsappMessage,
      });
      if (whatsappSent) results.whatsappSent++;

      // Mark as sent if at least one notification was successful
      if (emailSent || whatsappSent) {
        db.orders.markReminderSent(order.id);
      } else {
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reminders processed',
      results,
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}

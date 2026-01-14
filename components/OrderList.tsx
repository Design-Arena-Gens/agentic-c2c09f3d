'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  orderDetails: string;
  amount: number;
  reminderSent: boolean;
}

export default function OrderList({ refresh }: { refresh: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendManualReminder = async (orderId: string) => {
    setSending(orderId);
    try {
      const response = await fetch('/api/reminders/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Reminder sent successfully!');
        fetchOrders();
      } else {
        alert('❌ Failed to send reminder');
      }
    } catch (error) {
      alert('❌ Error sending reminder');
    } finally {
      setSending(null);
    }
  };

  const getDaysOld = (orderDate: string) => {
    const days = Math.floor(
      (Date.now() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="order-list">
      <h2>सभी ऑर्डर्स ({orders.length})</h2>

      {orders.length === 0 ? (
        <p className="no-orders">कोई ऑर्डर नहीं है</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const daysOld = getDaysOld(order.orderDate);
            const needsReminder = daysOld >= 10 && !order.reminderSent;

            return (
              <div key={order.id} className={`order-card ${needsReminder ? 'needs-reminder' : ''}`}>
                <div className="order-header">
                  <h3>{order.customerName}</h3>
                  {order.reminderSent && <span className="badge sent">✓ Sent</span>}
                  {needsReminder && <span className="badge pending">⏰ Pending</span>}
                </div>

                <div className="order-info">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  <p><strong>Phone:</strong> {order.customerPhone}</p>
                  <p><strong>Amount:</strong> ₹{order.amount}</p>
                  {order.orderDetails && <p><strong>Details:</strong> {order.orderDetails}</p>}
                  <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString('en-IN')} ({daysOld} days ago)</p>
                </div>

                {!order.reminderSent && (
                  <button
                    className="send-btn"
                    onClick={() => sendManualReminder(order.id)}
                    disabled={sending === order.id}
                  >
                    {sending === order.id ? 'Sending...' : 'Send Reminder Now'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

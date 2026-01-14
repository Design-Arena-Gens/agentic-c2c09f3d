'use client';

import { useState } from 'react';

export default function OrderForm({ onOrderCreated }: { onOrderCreated: () => void }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderDetails: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Order created successfully!');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          orderDetails: '',
          amount: '',
        });
        onOrderCreated();
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>नया ऑर्डर बनाएं</h2>

      <div className="form-group">
        <label>Customer Name *</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number (WhatsApp) *</label>
        <input
          type="tel"
          placeholder="+919876543210"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Order Details</label>
        <textarea
          value={formData.orderDetails}
          onChange={(e) => setFormData({ ...formData, orderDetails: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Order'}
      </button>

      {message && <div className="message">{message}</div>}
    </form>
  );
}

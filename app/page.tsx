'use client';

import { useState } from 'react';
import OrderForm from '@/components/OrderForm';
import OrderList from '@/components/OrderList';
import CronTrigger from '@/components/CronTrigger';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="container">
      <header>
        <h1>📦 Order Reminder System</h1>
        <p>Customer के order के 10 दिन बाद automatic email और WhatsApp reminder भेजें</p>
      </header>

      <div className="grid">
        <div className="card">
          <OrderForm onOrderCreated={handleRefresh} />
        </div>

        <div className="card">
          <CronTrigger onTriggered={handleRefresh} />
        </div>
      </div>

      <div className="card full-width">
        <OrderList refresh={refreshKey} />
      </div>

      <footer>
        <p>Built with Next.js • Email: Nodemailer • WhatsApp: Twilio</p>
      </footer>
    </main>
  );
}

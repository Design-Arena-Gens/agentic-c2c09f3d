'use client';

import { useState } from 'react';

export default function CronTrigger({ onTriggered }: { onTriggered: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerCron = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/cron/send-reminders');
      const data = await response.json();
      setResult(data);
      if (data.success) {
        onTriggered();
      }
    } catch (error) {
      setResult({ success: false, error: 'Failed to trigger cron job' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cron-trigger">
      <h2>Automated Reminder System</h2>
      <p>यह सिस्टम हर दिन automatic चलेगा और 10 दिन पुराने orders के लिए reminder भेजेगा।</p>

      <button onClick={triggerCron} disabled={loading} className="cron-btn">
        {loading ? 'Processing...' : '🔄 Run Reminder Check Now'}
      </button>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="cron-info">
        <h3>How it works:</h3>
        <ul>
          <li>✅ System checks for orders that are 10+ days old</li>
          <li>📧 Sends automated email to customer</li>
          <li>📱 Sends WhatsApp message to customer's phone</li>
          <li>✓ Marks order as "reminder sent"</li>
          <li>⏰ Setup a cron job to call: <code>/api/cron/send-reminders</code></li>
        </ul>
      </div>
    </div>
  );
}

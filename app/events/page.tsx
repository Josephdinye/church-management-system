// app/events/page.tsx
'use client';

import Navbar from '@/components/Navbar';
import { churchConfig } from '@/lib/config';
import { useState, useEffect } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: '100px' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(rgba(30,58,138,0.85), rgba(30,58,138,0.9))',
          color: 'white',
          textAlign: 'center',
          padding: '140px 20px 100px'
        }}>
          <h1 style={{ fontSize: '3.8rem', fontWeight: '700', marginBottom: '1rem' }}>
            Upcoming Events
          </h1>
          <p style={{ fontSize: '1.4rem' }}>Join us in worship, fellowship, and spiritual growth</p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.3rem', color: '#666' }}>
              No upcoming events at the moment.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {events.map((event: any) => (
                <div key={event.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e3a8a' }}>
                      {event.title}
                    </h3>
                    <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    {event.time && <p style={{ color: '#6b7280' }}>Time: {event.time}</p>}
                    {event.location && <p style={{ color: '#6b7280' }}>Location: {event.location}</p>}
                    
                    {event.description && (
                      <p style={{ marginTop: '1rem', color: '#374151' }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4rem 5%', textAlign: 'center' }}>
          <p>&copy; 2026 {churchConfig.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
// app/(dashboard)/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventTable from '@/components/events/event-table';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event: any) => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return new Date(event.date) >= new Date();
    if (filter === 'Past') return new Date(event.date) < new Date();
    return event.type === filter;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            Church Events
          </h1>
          <p style={{ color: '#6b7280' }}>Manage all services, meetings, and special programs</p>
        </div>

        <Link href="/dashboard/events/new" style={{
          padding: '14px 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
        }}>
          + Create New Event
        </Link>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Upcoming', 'Past'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '10px 24px',
              backgroundColor: filter === f ? '#4f46e5' : '#f3f4f6',
              color: filter === f ? 'white' : '#374151',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Loading events...
        </div>
      ) : (
        <EventTable events={filteredEvents} />
      )}

      {filteredEvents.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '5rem', 
          color: '#9ca3af',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          No events found for the selected filter.
        </div>
      )}
    </div>
  );
}
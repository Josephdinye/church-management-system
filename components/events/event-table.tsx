// components/events/event-table.tsx
'use client';

import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  expectedAttendees: number;
  status?: string;
};

interface EventTableProps {
  events: Event[];
}

export default function EventTable({ events }: EventTableProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600' }}>Event Title</th>
              <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600' }}>Date & Time</th>
              <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600' }}>Location</th>
              <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
              <th style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '600' }}>Expected</th>
              <th style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isUpcoming = eventDate >= new Date();

              return (
                <tr key={event.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>{event.title}</p>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <p style={{ fontWeight: '500' }}>
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14.5px' }}>{event.time}</p>
                  </td>
                  <td style={{ padding: '1.25rem', color: '#374151' }}>{event.location}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{
                      padding: '6px 16px',
                      backgroundColor: '#f0f9ff',
                      color: '#3b82f6',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {event.type}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '600', color: '#10b981' }}>
                    {event.expectedAttendees}
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <Link 
                      href={`/dashboard/events/${event.id}`}
                      style={{ 
                        color: '#4f46e5', 
                        textDecoration: 'none',
                        marginRight: '16px',
                        fontWeight: '500'
                      }}
                    >
                      View
                    </Link>
                    <Link 
                      href={`/dashboard/events/${event.id}`}
                      style={{ 
                        color: '#4f46e5', 
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
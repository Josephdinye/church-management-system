// app/(dashboard)/events/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import EventForm from '@/components/events/event-form';

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('✅ Event updated successfully!');
        setIsEditing(false);
        fetchEvent(); // Refresh data
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading event...</div>;
  if (!event) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <Link href="/dashboard/events" style={{ color: '#4f46e5' }}>
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
            {isEditing ? 'Edit Event' : event.title}
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {event.time}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditing && (
            <>
              <Link 
                href="/dashboard/events"
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  background: 'white',
                  textDecoration: 'none',
                  color: '#374151'
                }}
              >
                ← Back to Events
              </Link>

              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit Event
              </button>
            </>
          )}
        </div>
      </div>

      {/* View or Edit Mode */}
      {isEditing ? (
        <EventForm 
          initialData={event} 
          onSubmit={handleEditSubmit} 
          isLoading={saving}
          isEdit={true}
        />
      ) : (
        /* Professional View Mode */
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2.5rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
            {/* Event Info */}
            <div>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>
                {event.type === 'Worship' ? '🙏' : event.type === 'Bible Study' ? '📖' : event.type === 'Prayer' ? '🛐' : '🎉'}
              </div>
              <h2 style={{ fontSize: '26px', marginBottom: '1rem' }}>{event.title}</h2>
              <p style={{ color: '#6b7280', fontSize: '17px' }}>{event.type} Event</p>
            </div>

            {/* Details */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', lineHeight: '1.9' }}>
                <div><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div><strong>Time:</strong> {event.time}</div>
                <div><strong>Location:</strong> {event.location}</div>
                <div><strong>Expected Attendees:</strong> {event.expectedAttendance || '—'}</div>
              </div>

              {event.description && (
                <div style={{ marginTop: '2rem' }}>
                  <strong>Description:</strong>
                  <p style={{ marginTop: '8px', lineHeight: '1.8' }}>{event.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
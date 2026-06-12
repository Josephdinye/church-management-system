'use client';

import { useState, useEffect } from 'react';
import StatsCards from '@/components/dashboard/stats-cards';
import Link from 'next/link';
import { churchConfig } from '@/lib/config';

export default function DashboardPage() {
  const [recentMembers, setRecentMembers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(false);
        
        const [membersRes, eventsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/events')
        ]);

        const members = membersRes.ok ? await membersRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];

        // Recent Members (latest 4)
        setRecentMembers(members.slice(0, 4));

        // Upcoming Events (sorted by date)
        const upcoming = events
          .filter((event: any) => new Date(event.date) >= new Date())
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);

        setUpcomingEvents(upcoming);

      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome to {churchConfig.shortName}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Here's what's happening in your church today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>

        {/* Recent Members */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Recent Members</h2>
            <Link href="/dashboard/members" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading recent members...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>Unable to load members</p>
          ) : recentMembers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentMembers.map((member: any) => (
                <div key={member.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: '#e0e7ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#4f46e5',
                      fontSize: '18px'
                    }}>
                      {member.fullName?.[0] || '👤'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600' }}>{member.fullName}</p>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        Joined {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No members registered yet.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Upcoming Events</h2>
            <Link href="/dashboard/events" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading events...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>Unable to load events</p>
          ) : upcomingEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {upcomingEvents.map((event: any) => (
                <div key={event.id} style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '6px' }}>{event.title}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} • {event.time || 'TBD'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No upcoming events scheduled.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/dashboard/members/new" style={{
            padding: '16px 32px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
          }}>
            + Add New Member
          </Link>
          
          <Link href="/dashboard/events/new" style={{
            padding: '16px 32px',
            backgroundColor: 'white',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            + Create New Event
          </Link>

          <Link href="/dashboard/attendance" style={{
            padding: '16px 32px',
            backgroundColor: 'white',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Mark Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}
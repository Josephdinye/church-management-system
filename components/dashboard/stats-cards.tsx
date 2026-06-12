// components/dashboard/stats-cards.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType?: 'positive' | 'negative';
  icon: string;
  link: string;
}

const StatCard = ({ title, value, change, changeType = 'positive', icon, link }: StatCardProps) => {
  const isPositive = changeType === 'positive';
  
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.75rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '8px' }}>
              {title}
            </p>
            <p style={{ 
              fontSize: '42px', 
              fontWeight: '700',
              marginBottom: '4px',
              color: '#111827'
            }}>
              {value}
            </p>
          </div>
          <div style={{ fontSize: '36px', opacity: 0.85 }}>
            {icon}
          </div>
        </div>

        <p style={{ 
          fontSize: '14.5px',
          color: isPositive ? '#10b981' : '#ef4444',
          fontWeight: '500'
        }}>
          {change}
        </p>
      </div>
    </Link>
  );
};

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeEvents: 0,
    attendanceRate: "0%",
    totalOfferings: "₵0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total Members
        const membersRes = await fetch('/api/members');
        const members = membersRes.ok ? await membersRes.json() : [];

        // Active/Upcoming Events
        const eventsRes = await fetch('/api/events');
        const events = eventsRes.ok ? await eventsRes.json() : [];

        const upcomingEvents = events.filter((e: any) => new Date(e.date) >= new Date());

        // Finances
        const financesRes = await fetch('/api/finances');
        const finances = financesRes.ok ? await financesRes.json() : { totalOfferings: 0 };

        setStats({
          totalMembers: members.length,
          activeEvents: upcomingEvents.length,
          attendanceRate: "87%",                    // TODO: Calculate real percentage later
          totalOfferings: `₵${(finances.totalOfferings || 0).toLocaleString()}`,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard stats...</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2.5rem'
    }}>
      <StatCard 
        title="Total Members" 
        value={stats.totalMembers} 
        change="New members this month" 
        icon="👥" 
        link="/dashboard/members" 
      />
      <StatCard 
        title="Active Events" 
        value={stats.activeEvents} 
        change="Scheduled this month" 
        icon="📅" 
        link="/dashboard/events" 
      />
      <StatCard 
        title="Attendance Rate" 
        value={stats.attendanceRate} 
        change="Average this month" 
        icon="📊" 
        link="/dashboard/attendance" 
      />
      <StatCard 
        title="Total Offerings" 
        value={stats.totalOfferings} 
        change="This month" 
        icon="💰" 
        link="/dashboard/finances" 
      />
    </div>
  );
}
// app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type ExtendedSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as ExtendedSessionUser | undefined;
  const isAdmin = user?.role === 'ADMIN';
  
  const [activeTab, setActiveTab] = useState('church');

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your church information and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '2rem', 
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('church')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'church' ? '#4f46e5' : '#f3f4f6',
            color: activeTab === 'church' ? 'white' : '#374151',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Church Information
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'users' ? '#4f46e5' : '#f3f4f6',
            color: activeTab === 'users' ? 'white' : '#374151',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          User Management
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'preferences' ? '#4f46e5' : '#f3f4f6',
            color: activeTab === 'preferences' ? 'white' : '#374151',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          System Preferences
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'church' && (
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginBottom: '2rem' }}>Church Information</h2>
          <p style={{ color: '#6b7280' }}>Church profile settings coming soon...</p>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <Link href="/dashboard/settings/users" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 32px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Manage Users →
            </button>
          </Link>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
            Only users with <strong>ADMIN</strong> role can create, edit, or delete users.
          </p>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginBottom: '2rem' }}>System Preferences</h2>
          <p style={{ color: '#6b7280' }}>System-wide preferences coming soon...</p>
        </div>
      )}
    </div>
  );
}
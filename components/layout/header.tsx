// components/layout/header.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600' }}>
          ChurchHub
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {session?.user && (
          <>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600' }}>{session.user.name}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{session.user.email}</p>
            </div>

            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              {session.user.name?.[0] || 'U'}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/members', label: 'Members', icon: '👥' },
    { href: '/dashboard/events', label: 'Events', icon: '📅' },
    { href: '/dashboard/attendance', label: 'Attendance', icon: '📊' },
    { href: '/dashboard/finances', label: 'Finances', icon: '💰' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
      zIndex: 50,
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', width: '40px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>ChurchHub</h1>
        </div>
      </div>

      <nav style={{ padding: '1rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                marginBottom: '4px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#4f46e5' : '#374151',
                backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
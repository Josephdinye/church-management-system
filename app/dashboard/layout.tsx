// app/(dashboard)/layout.tsx
'use client';

import { useState } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { churchConfig } from '@/lib/config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardContent>{children}</DashboardContent>
    </SessionProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/members', label: 'Members', icon: '👥' },
    { href: '/dashboard/finances', label: 'Finances', icon: '💰' },
    { href: '/dashboard/events', label: 'Events', icon: '📅' },
    { href: '/dashboard/attendance', label: 'Attendance', icon: '📊' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    try {
      // Most reliable method
      await signOut({ 
        redirect: true, 
        callbackUrl: '/login' 
      });
    } catch (error) {
      // Fallback
      console.error(error);
      window.location.href = '/login';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '70px',
        transition: 'width 0.3s',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
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
            {sidebarOpen && (
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                {churchConfig.shortName}
              </h1>
            )}
          </div>
        </div>

        <nav style={{ padding: '1rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            
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
                  backgroundColor: isActive ? '#eef2ff' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.3s',
        flex: 1,
        minHeight: '100vh'
      }}>
        {/* Top Navbar */}
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
          height: '70px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ☰
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>
              {navItems.find(item => pathname?.startsWith(item.href))?.label || 'Dashboard'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', margin: 0 }}>{session?.user?.name}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{session?.user?.email}</p>
            </div>

            {/* Logout Button - Prominent */}
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 22px',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
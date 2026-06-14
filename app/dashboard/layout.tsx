// app/(dashboard)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { churchConfig } from '@/lib/config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardContent>{children}</DashboardContent>
    </SessionProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Detect mobile and auto-collapse sidebar
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error(error);
      window.location.href = '/login';
    }
  };

  const sidebarWidth = sidebarOpen ? '260px' : '70px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Mobile overlay — closes sidebar when tapping outside */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 49,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: sidebarWidth,
        transition: 'width 0.3s, transform 0.3s',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 50,
        // On mobile: slide off-screen when closed
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px', width: '40px', flexShrink: 0 }} />
            {sidebarOpen && (
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>
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
                onClick={() => isMobile && setSidebarOpen(false)}
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
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        // On mobile: no margin (sidebar overlays), on desktop: push by sidebar width
        marginLeft: isMobile ? '0' : sidebarWidth,
        transition: 'margin-left 0.3s',
        flex: 1,
        minHeight: '100vh',
        minWidth: 0,
      }}>
        {/* Top Navbar */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',                              // ← changed from 'sticky'
          top: 0,
          right: 0,
          left: isMobile ? '0' : sidebarWidth,           // ← added
          zIndex: 40,
          height: '70px',
          gap: '12px',
          transition: 'left 0.3s',                       // ← added
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ padding: '8px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', flexShrink: 0 }}
            >
              ☰
            </button>
            <h2 style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {navItems.find(item => pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href)))?.label || 'Dashboard'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Hide user info on very small screens */}
            <div style={{ textAlign: 'right', display: 'var(--user-info-display, block)' }}
              className="dash-user-info">
              <p style={{ fontWeight: '600', margin: 0, fontSize: 'clamp(12px, 1.5vw, 15px)', whiteSpace: 'nowrap' }}>
                {session?.user?.name}
              </p>
              <p style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', color: '#6b7280', whiteSpace: 'nowrap' }}>
                {session?.user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: 'clamp(8px, 1vw, 10px) clamp(12px, 2vw, 22px)',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(12px, 1.2vw, 15px)',
              }}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: 'clamp(1rem, 3vw, 2rem)', paddingTop: 'calc(70px + clamp(1rem, 3vw, 2rem))', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Hide user info on small screens */}
      <style>{`
        @media (max-width: 480px) {
          .dash-user-info { display: none !important; }
        }
      `}</style>
    </div>
  );
}
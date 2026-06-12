// components/Navbar.tsx
import Link from 'next/link';
import { churchConfig } from '@/lib/config';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      padding: '1.1rem 5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {/* Logo + Name - Clickable to Home */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        <img src={churchConfig.logo} alt="Logo" style={{ height: '52px' }} />
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0, color: '#1e3a8a' }}>
            {churchConfig.name}
          </h1>
          <p style={{ fontSize: '13px', margin: 0, color: '#64748b' }}>{churchConfig.shortName}</p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '15.5px', fontWeight: '500' }}>
        <Link href="/" style={{ color: '#334155', textDecoration: 'none' }}>Home</Link>
        <Link href="/about" style={{ color: '#334155', textDecoration: 'none' }}>About</Link>
        <Link href="/events" style={{ color: '#334155', textDecoration: 'none' }}>Events</Link>
        <Link href="/ministries" style={{ color: '#334155', textDecoration: 'none' }}>Ministries</Link>
        <Link href="/give" style={{ color: '#334155', textDecoration: 'none' }}>Give</Link>
        <Link href="/contact" style={{ color: '#334155', textDecoration: 'none' }}>Contact</Link>
      </div>

      {/* Admin Portal */}
      <Link href="/login" style={{
        padding: '13px 32px',
        backgroundColor: '#1e3a8a',
        color: 'white',
        borderRadius: '9999px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '15.5px'
      }}>
        Admin Portal
      </Link>
    </nav>
  );
}
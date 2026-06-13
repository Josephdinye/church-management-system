// components/Navbar.tsx
'use client';

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
      padding: '1rem 5%',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={churchConfig.logo} alt="Logo" style={{ height: '48px' }} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#1e3a8a' }}>
              {churchConfig.name}
            </h1>
          </div>
        </Link>

        {/* Navigation Links - Always Visible */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(16px, 3vw, 32px)', 
          fontSize: '15.5px', 
          fontWeight: '500',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link href="/" style={{ color: '#334155', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: '#334155', textDecoration: 'none' }}>About</Link>
          <Link href="/events" style={{ color: '#334155', textDecoration: 'none' }}>Events</Link>
          <Link href="/ministries" style={{ color: '#334155', textDecoration: 'none' }}>Ministries</Link>
          <Link href="/give" style={{ color: '#334155', textDecoration: 'none' }}>Give</Link>
          <Link href="/contact" style={{ color: '#334155', textDecoration: 'none' }}>Contact</Link>
        </div>

        {/* Admin Login Button */}
        <Link 
          href="/login" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            padding: '11px 26px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          Admin Login
        </Link>
      </div>
    </nav>
  );
}
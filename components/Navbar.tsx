// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { churchConfig } from '@/lib/config';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={churchConfig.logo} alt="Logo" style={{ height: '45px' }} />
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#1e3a8a' }}>
              {churchConfig.name}
            </h1>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'none', gap: '28px', fontSize: '15.5px', fontWeight: '500', alignItems: 'center' }} className="desktop-menu">
          <Link href="/" style={{ color: '#334155', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: '#334155', textDecoration: 'none' }}>About</Link>
          <Link href="/events" style={{ color: '#334155', textDecoration: 'none' }}>Events</Link>
          <Link href="/ministries" style={{ color: '#334155', textDecoration: 'none' }}>Ministries</Link>
          <Link href="/contact" style={{ color: '#334155', textDecoration: 'none' }}>Contact</Link>
        </div>

        {/* Admin Login */}
        <Link 
          href="/login" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            padding: '10px 24px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          Admin Login
        </Link>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} 
          className="mobile-menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          backgroundColor: 'white', 
          padding: '20px', 
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link href="/" style={{ color: '#334155', textDecoration: 'none', fontSize: '17px' }}>Home</Link>
          <Link href="/about" style={{ color: '#334155', textDecoration: 'none', fontSize: '17px' }}>About</Link>
          <Link href="/events" style={{ color: '#334155', textDecoration: 'none', fontSize: '17px' }}>Events</Link>
          <Link href="/ministries" style={{ color: '#334155', textDecoration: 'none', fontSize: '17px' }}>Ministries</Link>
          <Link href="/contact" style={{ color: '#334155', textDecoration: 'none', fontSize: '17px' }}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
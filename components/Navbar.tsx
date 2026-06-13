// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { churchConfig } from '@/lib/config';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '1rem 5%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
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

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <Link href="/" style={{ color: '#334155', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: '#334155', textDecoration: 'none' }}>About</Link>
          <Link href="/events" style={{ color: '#334155', textDecoration: 'none' }}>Events</Link>
          <Link href="/ministries" style={{ color: '#334155', textDecoration: 'none' }}>Ministries</Link>
          <Link href="/give" style={{ color: '#334155', textDecoration: 'none' }}>Give</Link>
          <Link href="/contact" style={{ color: '#334155', textDecoration: 'none' }}>Contact</Link>
        </div>

        {/* Admin Login */}
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
            fontSize: '15px'
          }}
        >
          Admin Login
        </Link>

        {/* Hamburger for Mobile */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-hamburger"
          style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link href="/ministries" onClick={() => setMenuOpen(false)}>Ministries</Link>
          <Link href="/give" onClick={() => setMenuOpen(false)}>Give</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
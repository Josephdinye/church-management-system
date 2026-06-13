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
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={churchConfig.logo} alt="Logo" style={{ height: '45px' }} />
          <div>
            <h1 style={{ 
              fontSize: 'clamp(18px, 4.5vw, 26px)', 
              fontWeight: '700', 
              margin: 0, 
              color: '#1e3a8a' 
            }}>
              {churchConfig.name}
            </h1>
          </div>
        </Link>

        {/* Navigation Links - Show as much as possible */}
        <div className="desktop-nav" style={{
          display: 'none',
          gap: 'clamp(10px, 1.8vw, 22px)',
          fontSize: 'clamp(13px, 1.7vw, 15px)',
          fontWeight: '500',
          alignItems: 'center',
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
          className="desktop-admin"
          style={{
            padding: 'clamp(8px, 1.5vw, 11px) clamp(16px, 2.5vw, 26px)',
            backgroundColor: '#1e3a8a',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(13px, 1.7vw, 15px)',
            whiteSpace: 'nowrap'
          }}
        >
          Admin Login
        </Link>

        {/* Hamburger - Only on very small screens */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-hamburger"
          style={{ 
            fontSize: '30px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}
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
          
          <Link 
            href="/login" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '14px 24px',
              backgroundColor: '#1e3a8a',
              color: 'white',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: '600',
              textAlign: 'center',
              marginTop: '10px'
            }}
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
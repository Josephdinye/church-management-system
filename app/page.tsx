// app/page.tsx
import Navbar from '@/components/Navbar';
import { churchConfig } from '@/lib/config';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        height: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        paddingTop: '80px'
      }}>
        <div style={{ maxWidth: '820px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '4.6rem', fontWeight: '800', lineHeight: '1.05', marginBottom: '1.8rem' }}>
            Welcome to<br />{churchConfig.name}
          </h1>
          <p style={{ fontSize: '1.45rem', marginBottom: '3rem', opacity: 0.95 }}>
            {churchConfig.tagline}
          </p>
          <Link href="/about" style={{
            padding: '18px 42px',
            backgroundColor: 'white',
            color: '#1e3a8a',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.2rem'
          }}>
            Learn More About Us
          </Link>
        </div>
      </section>

      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4rem 5%', textAlign: 'center' }}>
        <p>&copy; 2026 {churchConfig.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
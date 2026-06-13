// app/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { churchConfig } from '@/lib/config';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Navbar />

      {/* Main Content Area - This grows to push footer down */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{
          minHeight: '100vh',
          background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3") center/cover no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          paddingTop: '90px'
        }}>
          <div style={{ 
            maxWidth: '860px', 
            padding: '0 20px',
            width: '100%'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2.8rem, 8vw, 4.6rem)', 
              fontWeight: '800', 
              lineHeight: '1.05', 
              marginBottom: '1.5rem' 
            }}>
              Welcome to<br />{churchConfig.name}
            </h1>
            
            <p style={{ 
              fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', 
              marginBottom: '2.8rem', 
              opacity: 0.95,
              maxWidth: '620px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {churchConfig.tagline}
            </p>

            <Link href="/about" style={{
              display: 'inline-block',
              padding: '18px 42px',
              backgroundColor: 'white',
              color: '#1e3a8a',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: 'clamp(1.1rem, 2.8vw, 1.2rem)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              Learn More About Us
            </Link>
          </div>
        </section>
      </main>

      {/* Footer - Always at the bottom */}
      <Footer />
    </div>
  );
}
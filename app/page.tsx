// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #1e40af, #3b82f6, #6366f1)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 5rem',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Church Logo" style={{ height: '50px', width: '50px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>ChurchHub</h1>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/login" style={{
            padding: '12px 28px',
            color: 'white',
            border: '2px solid white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            Login
          </Link>
          <Link href="/register" style={{
            padding: '12px 28px',
            backgroundColor: 'white',
            color: '#1e40af',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 6rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '4.2rem', 
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: '1.5rem'
        }}>
          Manage Your Church with <span style={{ color: '#fde047' }}>Ease</span>
        </h1>

        <p style={{ 
          fontSize: '1.35rem', 
          maxWidth: '680px',
          marginBottom: '3rem',
          opacity: 0.95
        }}>
          A complete solution for member management, event planning, 
          attendance tracking, and document storage.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register" style={{
            padding: '18px 40px',
            backgroundColor: 'white',
            color: '#1e40af',
            fontSize: '1.2rem',
            fontWeight: '600',
            borderRadius: '9999px',
            textDecoration: 'none'
          }}>
            Start Free Trial
          </Link>
          
          <Link href="/login" style={{
            padding: '18px 40px',
            border: '2px solid white',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600',
            borderRadius: '9999px',
            textDecoration: 'none'
          }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        backgroundColor: 'white',
        color: '#111827',
        padding: '6rem 2rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '3rem' }}>
            Powerful Features
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {[
              { emoji: '👥', title: 'Member Management', desc: 'Track profiles, families, ministries, and contact information.' },
              { emoji: '📅', title: 'Event Planning', desc: 'Organize services, meetings, and special events effortlessly.' },
              { emoji: '📊', title: 'Attendance & Reports', desc: 'Real-time attendance tracking and insightful analytics.' }
            ].map((feature, i) => (
              <div key={i} style={{
                backgroundColor: '#f8fafc',
                padding: '2.5rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{feature.emoji}</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <p>&copy; 2026 ChurchHub. Built for the Kingdom.</p>
      </footer>
    </div>
  );
}
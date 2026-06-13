// app/about/page.tsx
import Navbar from '@/components/Navbar';
import { churchConfig } from '@/lib/config';

export default function AboutPage() {
  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: '100px' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(rgba(30,58,138,0.85), rgba(30,58,138,0.9))',
          color: 'white',
          textAlign: 'center',
          padding: '120px 20px 90px'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', 
            fontWeight: '700', 
            marginBottom: '1rem' 
          }}>
            About {churchConfig.shortName}
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', 
            maxWidth: '700px', 
            margin: '0 auto',
            opacity: 0.95
          }}>
            {churchConfig.tagline}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Story */}
            <div>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 2.6rem)', 
                fontWeight: '700', 
                marginBottom: '1.8rem', 
                color: '#1e3a8a' 
              }}>
                Our Story
              </h2>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '1.85', 
                color: '#374151' 
              }}>
                {churchConfig.name} was established in {churchConfig.establishedYear || '2001'} as a place of worship, fellowship, and spiritual growth.
              </p>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '1.85', 
                color: '#374151', 
                marginTop: '1.5rem' 
              }}>
                Our mission is simple: To know Christ and to make Him known.
              </p>
            </div>

            {/* Core Values */}
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '2.8rem', 
              borderRadius: '16px' 
            }}>
              <h3 style={{ 
                fontSize: '1.7rem', 
                marginBottom: '1.8rem',
                color: '#1e3a8a'
              }}>
                Our Core Values
              </h3>
              <ul style={{ 
                lineHeight: '2.2', 
                fontSize: '1.15rem',
                color: '#374151'
              }}>
                <li>❤️ <strong>Love God & Love People</strong></li>
                <li>📖 <strong>Biblical Teaching</strong></li>
                <li>🙏 <strong>Spirit-Led Worship</strong></li>
                <li>🤝 <strong>Authentic Community</strong></li>
                <li>🌍 <strong>Kingdom Impact</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          backgroundColor: '#0f172a', 
          color: '#94a3b8', 
          padding: '4rem 5%', 
          textAlign: 'center' 
        }}>
          <p>&copy; 2026 {churchConfig.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
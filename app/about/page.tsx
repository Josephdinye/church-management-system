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
          padding: '140px 20px 100px'
        }}>
          <h1 style={{ fontSize: '3.8rem', fontWeight: '700', marginBottom: '1rem' }}>
            About {churchConfig.shortName}
          </h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto' }}>
            {churchConfig.tagline}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.6rem', fontWeight: '700', marginBottom: '2rem', color: '#1e3a8a' }}>
                Our Story
              </h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#374151' }}>
                {churchConfig.name} was established in {churchConfig.establishedYear || '2001'} as a place of worship, fellowship, and spiritual growth.
              </p>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#374151', marginTop: '1.5rem' }}>
                Our mission is simple: To know Christ and to make Him known.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Our Core Values</h3>
              <ul style={{ lineHeight: '2.1', fontSize: '1.15rem' }}>
                <li>❤️ <strong>Love God & Love People</strong></li>
                <li>📖 <strong>Biblical Teaching</strong></li>
                <li>🙏 <strong>Spirit-Led Worship</strong></li>
                <li>🤝 <strong>Authentic Community</strong></li>
                <li>🌍 <strong>Kingdom Impact</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4rem 5%', textAlign: 'center' }}>
          <p>&copy; 2026 {churchConfig.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
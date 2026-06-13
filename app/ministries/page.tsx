// app/ministries/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { churchConfig } from '@/lib/config';

export default function MinistriesPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Navbar />

      {/* Main Content - Grows to push footer down */}
      <main style={{ flex: 1 }}>
        <div style={{ paddingTop: '100px' }}>
          {/* Hero */}
          <div style={{
            background: 'linear-gradient(rgba(30,58,138,0.85), rgba(30,58,138,0.9))',
            color: 'white',
            textAlign: 'center',
            padding: '140px 20px 100px'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', 
              fontWeight: '700', 
              marginBottom: '1rem' 
            }}>
              Our Ministries
            </h1>
            <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)' }}>
              Serving God by serving people
            </p>
          </div>

          {/* Ministries Grid */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '3rem',
              fontSize: 'clamp(2rem, 5vw, 2.6rem)'
            }}>
              Active Ministries
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {[
                { title: "Sunday School", desc: "Discipling children and youth in God's Word" },
                { title: "Prayer Ministry", desc: "Interceding for the church and community" },
                { title: "Youth Ministry", desc: "Raising a generation that loves Jesus" },
                { title: "Women’s Ministry", desc: "Empowering women in faith and leadership" },
                { title: "Men’s Fellowship", desc: "Building strong godly men" },
                { title: "Evangelism Team", desc: "Reaching the lost with the Gospel" },
              ].map((ministry, i) => (
                <div key={i} style={{ 
                  backgroundColor: 'white', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb' 
                }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e3a8a' }}>
                    {ministry.title}
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.7' }}>{ministry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Always at the bottom */}
      <Footer />
    </div>
  );
}
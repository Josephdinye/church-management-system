// app/give/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { churchConfig } from '@/lib/config';

export default function GivePage() {
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
              Give to {churchConfig.shortName}
            </h1>
            <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)' }}>Support the work of God</p>
          </div>

          {/* Content Area */}
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            padding: '80px 20px', 
            textAlign: 'center' 
          }}>
            <h2 style={{ marginBottom: '2rem' }}>Ways to Give</h2>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '3rem', 
              borderRadius: '16px', 
              border: '1px solid #e5e7eb' 
            }}>
              <p style={{ 
                fontSize: '1.3rem', 
                marginBottom: '2rem', 
                lineHeight: '1.8' 
              }}>
                Your generosity helps us spread the Gospel, support the needy, and expand God's kingdom.
              </p>

              <p style={{ 
                color: '#10b981', 
                fontWeight: '600', 
                fontSize: '1.2rem' 
              }}>
                Thank you for your partnership in the Gospel!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Always at the bottom */}
      <Footer />
    </div>
  );
}
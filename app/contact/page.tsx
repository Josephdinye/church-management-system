// app/contact/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { churchConfig } from '@/lib/config';

export default function ContactPage() {
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
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(rgba(30,58,138,0.85), rgba(30,58,138,0.9))',
            color: 'white',
            textAlign: 'center',
            padding: '120px 20px 80px'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', 
              fontWeight: '700', 
              marginBottom: '1rem' 
            }}>
              Contact Us
            </h1>
            <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)' }}>We'd love to hear from you</p>
          </div>

          {/* Main Content */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '3rem'
            }}>
              {/* Left Column - Get In Touch */}
              <div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '1.5rem' }}>Get In Touch</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151', marginBottom: '2rem' }}>
                  Have questions? Want to visit? Or just want to say hello?<br />
                  Reach out to us using the information below.
                </p>

                <div style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.9' }}>
                  <p><strong>Address:</strong><br />{churchConfig.address}</p>
                  <p style={{ marginTop: '1.2rem' }}><strong>Phone:</strong><br />{churchConfig.phone}</p>
                  <p style={{ marginTop: '1.2rem' }}><strong>Email:</strong><br />{churchConfig.email}</p>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1.8rem', fontSize: '1.6rem' }}>Send us a Message</h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <input type="text" placeholder="Your Name" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <input type="email" placeholder="Your Email" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <textarea placeholder="Your Message" rows={6} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical' }}></textarea>
                  <button type="button" style={{
                    padding: '16px',
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Always at the bottom */}
      <Footer />
    </div>
  );
}
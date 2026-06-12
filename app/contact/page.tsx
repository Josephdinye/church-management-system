// app/contact/page.tsx
import Navbar from '@/components/Navbar';
import { churchConfig } from '@/lib/config';

export default function ContactPage() {
  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: '100px' }}>
        <div style={{
          background: 'linear-gradient(rgba(30,58,138,0.85), rgba(30,58,138,0.9))',
          color: 'white',
          textAlign: 'center',
          padding: '140px 20px 100px'
        }}>
          <h1 style={{ fontSize: '3.8rem', fontWeight: '700', marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.4rem' }}>We'd love to hear from you</p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Get In Touch</h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#374151' }}>
                Have questions? Want to visit? Or just want to say hello?<br />
                Reach out to us using the information below.
              </p>

              <div style={{ marginTop: '3rem' }}>
                <p><strong>Address:</strong><br />{churchConfig.address}</p>
                <p style={{ marginTop: '1rem' }}><strong>Phone:</strong><br />{churchConfig.phone}</p>
                <p style={{ marginTop: '1rem' }}><strong>Email:</strong><br />{churchConfig.email}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Send us a Message</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Your Name" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                <input type="email" placeholder="Your Email" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                <textarea placeholder="Your Message" rows={6} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}></textarea>
                <button type="button" style={{
                  padding: '16px',
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Send Message
                </button>
              </form>
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
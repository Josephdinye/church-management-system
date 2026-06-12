// app/ministries/page.tsx
import Navbar from '@/components/Navbar';
import { churchConfig } from '@/lib/config';

export default function MinistriesPage() {
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
            Our Ministries
          </h1>
          <p style={{ fontSize: '1.4rem' }}>Serving God by serving people</p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Active Ministries</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: "Sunday School", desc: "Discipling children and youth in God's Word" },
              { title: "Prayer Ministry", desc: "Interceding for the church and community" },
              { title: "Youth Ministry", desc: "Raising a generation that loves Jesus" },
              { title: "Women’s Ministry", desc: "Empowering women in faith and leadership" },
              { title: "Men’s Fellowship", desc: "Building strong godly men" },
              { title: "Evangelism Team", desc: "Reaching the lost with the Gospel" },
            ].map((ministry, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{ministry.title}</h3>
                <p style={{ color: '#6b7280' }}>{ministry.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4rem 5%', textAlign: 'center' }}>
          <p>&copy; 2026 {churchConfig.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
// app/ministries/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { churchConfig } from '@/lib/config';

type Ministry = {
  id: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
};

async function getMinistries() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ministries`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    return data.filter((m: Ministry) => m.isActive);
  } catch (error) {
    console.error('Failed to fetch ministries:', error);
    return [];
  }
}

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

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

          {/* Ministries Grid - Clean Professional Cards */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
            {ministries.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '1.3rem', color: '#666' }}>
                No ministries available at the moment.
              </p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', 
                gap: '2.5rem' 
              }}>
                {ministries.map((ministry: Ministry) => (
                  <div key={ministry.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    {/* Large Image First */}
                    {ministry.image && (
                      <img 
                        src={ministry.image} 
                        alt={ministry.title}
                        style={{ 
                          width: '100%', 
                          height: '320px', 
                          objectFit: 'cover' 
                        }}
                      />
                    )}
                    
                    <div style={{ padding: '2.2rem' }}>
                      <h3 style={{ 
                        fontSize: '1.75rem', 
                        marginBottom: '1.2rem', 
                        color: '#1e3a8a',
                        fontWeight: '700',
                        lineHeight: '1.3'
                      }}>
                        {ministry.title}
                      </h3>
                      <p style={{ 
                        lineHeight: '1.85', 
                        color: '#374151',
                        fontSize: '1.08rem'
                      }}>
                        {ministry.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
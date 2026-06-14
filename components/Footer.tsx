// components/Footer.tsx
import { churchConfig } from '@/lib/config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      padding: '3.5rem 5% 2rem',
      textAlign: 'center',
      marginTop: 'auto',
      width: '100%'
    }}>
      <p style={{ fontSize: '1rem' }}>
        &copy; {currentYear} {churchConfig.name}. All Rights Reserved.
      </p>
      
      <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
        Developed by{' '}
        <a 
          href="https://josephdinye.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#60a5fa', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Joseph Tech. Solution
        </a>
      </p>
    </footer>
  );
}
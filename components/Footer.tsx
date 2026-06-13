// components/Footer.tsx
import { churchConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      padding: '3.5rem 5% 2rem',
      textAlign: 'center',
      marginTop: 'auto',           // Important for flex push
      width: '100%'
    }}>
      <p style={{ fontSize: '1rem' }}>
        &copy; 2026 {churchConfig.name}. All Rights Reserved.
      </p>
    </footer>
  );
}
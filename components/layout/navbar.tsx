// components/layout/navbar.tsx
'use client';

export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>ChurchHub</div>
      {/* Add more navbar items if needed */}
    </nav>
  );
}
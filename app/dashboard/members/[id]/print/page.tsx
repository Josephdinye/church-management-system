// app/(dashboard)/members/[id]/print/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function MemberPrintPage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/members/${id}`)
      .then(res => res.json())
      .then(data => setMember(data))
      .catch(() => {});
  }, [id]);

  const handlePrint = () => window.print();

  if (!member) {
    return <p style={{ textAlign: 'center', padding: '100px' }}>Loading document...</p>;
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          * { visibility: hidden !important; }
          .print-container, .print-container * { visibility: visible !important; }
          .print-container { 
            position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px 60px !important;
          }
          nav, header, aside, .sidebar, button, .no-print { display: none !important; }
          body, html { margin: 0; padding: 0; background: white; }
        }
      `}</style>

      <div className="print-container" style={{ 
        padding: '50px 70px', 
        maxWidth: '950px', 
        margin: '0 auto', 
        fontFamily: 'Georgia, serif',
        background: 'white',
        color: '#1f2937'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '50px', borderBottom: '5px solid #1e3a8a', paddingBottom: '35px' }}>
          <h1 style={{ fontSize: '38px', margin: '0', color: '#1e3a8a', letterSpacing: '1px' }}>
            THE WORLD LIGHT CHAPEL
          </h1>
          <p style={{ margin: '12px 0 4px 0', fontSize: '17px', color: '#334155' }}>
            P.O. Box 274 • Assin Fosu • Central Region, Ghana
          </p>
          <p style={{ margin: '4px 0', fontSize: '16px', color: '#334155' }}>
            E-mail: info@worldlightchapel.org • Phone: +233 24 293 0467
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', color: '#64748b' }}>
            Established 2001 | Serving with Love
          </p>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '40px', fontSize: '28px' }}>
          MEMBER INFORMATION
        </h2>

        <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
          {/* Photo - Full Image Without Cropping */}
          <div>
            <div style={{
              width: '240px',
              height: '280px',           // Slightly taller frame
              borderRadius: '12px',
              border: '8px solid #e5e7eb',
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}>
              {member.photo ? (
                <img 
                  src={member.photo} 
                  alt={member.fullName} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',     // ← Changed from 'cover' to 'contain'
                    backgroundColor: '#f8fafc'
                  }} 
                />
              ) : (
                <div style={{ 
                  fontSize: '100px', 
                  paddingTop: '80px', 
                  textAlign: 'center', 
                  color: '#cbd5e1' 
                }}>👤</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '17px' }}>
              <tbody>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold', width: '170px' }}>Membership Number</td><td>: <strong>{member.membershipNumber}</strong></td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Full Name</td><td>: {member.fullName}</td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Email</td><td>: {member.email || '—'}</td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Phone</td><td>: {member.phone || '—'}</td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Date of Birth</td><td>: {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '—'}</td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Gender</td><td>: {member.gender || '—'}</td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Status</td><td>: <strong>{member.status}</strong></td></tr>
                <tr><td style={{ padding: '12px 0', fontWeight: 'bold' }}>Join Date</td><td>: {new Date(member.joinDate).toLocaleDateString()}</td></tr>
              </tbody>
            </table>

            <div style={{ marginTop: '35px' }}>
              <strong style={{ fontSize: '17px' }}>Address:</strong>
              <p style={{ marginTop: '10px', lineHeight: '1.9', fontSize: '17px' }}>
                {member.address}<br />
                {member.city && `${member.city}, `}{member.country}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '100px', 
          textAlign: 'center', 
          borderTop: '1px dashed #94a3b8', 
          paddingTop: '30px',
          fontSize: '14.5px',
          color: '#64748b'
        }}>
          This document is officially issued by The World Light Chapel • {new Date().toLocaleDateString()}
        </div>

        <div className="no-print" style={{ textAlign: 'center', marginTop: '70px' }}>
          <button 
            onClick={handlePrint}
            style={{
              padding: '14px 40px',
              backgroundColor: '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    </>
  );
}
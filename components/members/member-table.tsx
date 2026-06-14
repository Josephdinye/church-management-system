// components/members/member-table.tsx
'use client';

import Link from 'next/link';

type Member = {
  id: string;
  membershipNumber?: string;
  fullName: string;
  email?: string;
  phone?: string;
  photo?: string;
  joinDate: string;
  status: string;
};

export default function MemberTable({ members }: { members: Member[] }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      {/* Mobile Horizontal Scroll */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          minWidth: '900px',        // Ensures full view on mobile with scroll
          borderCollapse: 'collapse' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', width: '60px' }}></th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Membership No.</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Full Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Join Date</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                {/* Photo */}
                <td style={{ padding: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f8fafc'
                  }}>
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.fullName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ fontSize: '20px', paddingTop: '8px', textAlign: 'center' }}>👤</div>
                    )}
                  </div>
                </td>

                <td style={{ 
                  padding: '1rem', 
                  fontWeight: '700', 
                  fontFamily: 'monospace',
                  color: '#4f46e5'
                }}>
                  {member.membershipNumber || '—'}
                </td>

                <td style={{ padding: '1rem', fontWeight: '500' }}>{member.fullName}</td>
                <td style={{ padding: '1rem' }}>{member.email || '—'}</td>
                <td style={{ padding: '1rem' }}>{member.phone || '—'}</td>
                <td style={{ padding: '1rem' }}>{member.joinDate}</td>

                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: member.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                    color: member.status === 'Active' ? '#10b981' : '#ef4444',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {member.status}
                  </span>
                </td>

                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <Link 
                    href={`/dashboard/members/${member.id}`}
                    style={{ color: '#4f46e5', marginRight: '16px', textDecoration: 'none', fontWeight: '500' }}
                  >
                    View/Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
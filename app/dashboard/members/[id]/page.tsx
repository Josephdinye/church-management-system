// app/(dashboard)/members/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MemberForm from '@/components/members/member-form';

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        console.error('Failed to fetch member');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.open(`/dashboard/members/${id}/print`, '_blank');
  };

  const handleEditSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('✅ Member updated successfully!');
        setIsEditing(false);
        fetchMember(); // Refresh the data
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update member');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (!member) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2>Member Not Found</h2>
        <p>The member you're looking for does not exist or has been removed.</p>
        <Link href="/dashboard/members" style={{ color: '#4f46e5' }}>
          ← Back to Members List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
            {isEditing ? 'Edit Member Information' : 'Member Profile'}
          </h1>
          <p style={{ color: '#4f46e5', fontSize: '20px', fontWeight: '600', marginTop: '4px' }}>
            {member.membershipNumber}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditing && (
            <>
              <button 
                onClick={handlePrint}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print Profile
              </button>

              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit Information
              </button>
            </>
          )}

          <Link 
            href="/dashboard/members"
            style={{ 
              padding: '12px 24px', 
              border: '1px solid #d1d5db', 
              borderRadius: '8px',
              background: 'white',
              textDecoration: 'none',
              color: '#374151'
            }}
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* View or Edit Mode */}
      {isEditing ? (
        <MemberForm 
          initialData={member} 
          onSubmit={handleEditSubmit} 
          isLoading={saving}
          isEdit={true}
        />
      ) : (
        /* Read-only View */
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2.5rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '3rem' }}>
            {/* Photo */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '5px solid #e5e7eb',
                overflow: 'hidden',
                margin: '0 auto'
              }}>
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.fullName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ fontSize: '80px', paddingTop: '40px', backgroundColor: '#f8fafc', height: '100%' }}>👤</div>
                )}
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '26px', marginBottom: '1.5rem' }}>{member.fullName}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', lineHeight: '1.8' }}>
                <div><strong>Membership No:</strong> {member.membershipNumber}</div>
                <div><strong>Status:</strong> <span style={{ color: member.status === 'Active' ? '#10b981' : '#ef4444' }}>{member.status}</span></div>
                
                <div><strong>Email:</strong> {member.email || '—'}</div>
                <div><strong>Phone:</strong> {member.phone || '—'}</div>

                <div><strong>Date of Birth:</strong> {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '—'}</div>
                <div><strong>Gender:</strong> {member.gender || '—'}</div>

                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Address:</strong><br />
                  {member.address || '—'}<br />
                  {member.city && `${member.city}, `}{member.country || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
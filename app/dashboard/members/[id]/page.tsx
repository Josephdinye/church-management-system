'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MemberForm from '@/components/members/member-form';
import { churchConfig } from '@/lib/config';

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    // ... your existing print function (unchanged)
    const existingFrame = document.getElementById('print-frame');
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'print-frame';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Member Profile - ${member.fullName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; color: #1f2937; padding: 50px 70px; background: white; }
            h1 { font-size: 38px; color: #1e3a8a; letter-spacing: 1px; }
            h2 { font-size: 28px; color: #1e3a8a; text-align: center; margin-bottom: 40px; }
            .letterhead { text-align: center; margin-bottom: 50px; border-bottom: 5px solid #1e3a8a; padding-bottom: 35px; }
            .letterhead p { font-size: 16px; color: #334155; margin: 8px 0 0; }
            .content { display: flex; gap: 60px; align-items: flex-start; }
            .photo { width: 240px; height: 300px; border-radius: 12px; border: 8px solid #e5e7eb; overflow: hidden; background: #f8fafc; flex-shrink: 0; }
            .photo img { width: 100%; height: 100%; object-fit: contain; }
            .details { flex: 1; }
            table { width: 100%; border-collapse: collapse; font-size: 17px; }
            td { padding: 12px 0; vertical-align: top; }
            td:first-child { font-weight: bold; width: 180px; }
            .address { margin-top: 35px; font-size: 17px; line-height: 1.9; }
            .footer { margin-top: 80px; text-align: center; border-top: 1px dashed #94a3b8; padding-top: 30px; font-size: 14px; color: #64748b; }
            @page { size: A4 portrait; margin: 1cm; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <h1>${churchConfig.name}</h1>
            <p>${churchConfig.address}</p>
            <p>E-mail: ${churchConfig.email} • Phone: ${churchConfig.phone}</p>
          </div>

          <h2>MEMBER INFORMATION</h2>

          <div class="content">
            <div class="photo">
              ${member.photo
                ? `<img src="${member.photo}" alt="${member.fullName}" />`
                : `<div style="font-size:90px;padding-top:80px;text-align:center;color:#cbd5e1;">👤</div>`
              }
            </div>
            <div class="details">
              <table>
                <tbody>
                  <tr><td>Membership Number</td><td>: <strong>${member.membershipNumber}</strong></td></tr>
                  <tr><td>Full Name</td><td>: ${member.fullName}</td></tr>
                  <tr><td>Email</td><td>: ${member.email || '—'}</td></tr>
                  <tr><td>Phone</td><td>: ${member.phone || '—'}</td></tr>
                  <tr><td>Date of Birth</td><td>: ${member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '—'}</td></tr>
                  <tr><td>Gender</td><td>: ${member.gender || '—'}</td></tr>
                  <tr><td>Status</td><td>: <strong>${member.status}</strong></td></tr>
                  <tr><td>Join Date</td><td>: ${new Date(member.joinDate).toLocaleDateString()}</td></tr>
                </tbody>
              </table>
              <div class="address">
                <strong>Address:</strong><br/>
                ${member.address || '—'}<br/>
                ${member.city ? member.city + ', ' : ''}${member.country || ''}
              </div>
            </div>
          </div>

          <div class="footer">
            This document is officially issued by ${churchConfig.name} • ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 1000);
      }, 500);
    }
  };

  const handleEditSubmit = async (data: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Member updated successfully!' });
        setIsEditing(false);
        fetchMember();
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 32px)', fontWeight: '700' }}>
            {isEditing ? 'Edit Member Information' : 'Member Profile'}
          </h1>
          <p style={{ color: '#4f46e5', fontSize: 'clamp(18px, 4.5vw, 20px)', fontWeight: '600', marginTop: '4px' }}>
            {member.membershipNumber}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {!isEditing && (
            <>
              <button
                onClick={handlePrint}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🖨️ Print Profile
              </button>

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
              color: '#374151',
              whiteSpace: 'nowrap'
            }}
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '14px 20px',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <MemberForm
          initialData={member}
          onSubmit={handleEditSubmit}
          isLoading={saving}
          isEdit={true}
        />
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Photo */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                width: 'clamp(140px, 35vw, 180px)',
                height: 'clamp(140px, 35vw, 180px)',
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
                  <div style={{ fontSize: 'clamp(60px, 18vw, 80px)', paddingTop: 'clamp(25px, 8vw, 40px)', backgroundColor: '#f8fafc', height: '100%' }}>👤</div>
                )}
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h2 style={{ fontSize: 'clamp(24px, 6vw, 26px)', marginBottom: '1.5rem' }}>{member.fullName}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', lineHeight: '1.9', fontSize: 'clamp(15px, 4vw, 17px)' }}>
                <div><strong>Membership No:</strong> {member.membershipNumber}</div>
                <div><strong>Status:</strong> <span style={{ color: member.status === 'Active' ? '#10b981' : '#ef4444' }}>{member.status}</span></div>

                <div><strong>Email:</strong> {member.email || '—'}</div>
                <div><strong>Phone:</strong> {member.phone || '—'}</div>

                <div><strong>Date of Birth:</strong> {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '—'}</div>
                <div><strong>Gender:</strong> {member.gender || '—'}</div>

                <div>
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
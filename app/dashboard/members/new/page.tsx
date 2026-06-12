// app/(dashboard)/members/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberForm from '@/components/members/member-form';

export default function NewMemberPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        const message = `${data.fullName} has been added successfully!`;
        setSuccessMessage(message);
        
        // Auto redirect after showing success message
        setTimeout(() => {
          router.push('/dashboard/members');
          router.refresh();
        }, 1800);
      } else {
        setError(result.error || 'Failed to add member. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Add New Member
        </h1>
        <p style={{ color: '#6b7280', fontSize: '17px' }}>
          Register a new church member. All fields with * are required.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          padding: '16px 20px',
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '1px solid #a7f3d0',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '16px 20px',
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '1px solid #fecaca',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}

      <MemberForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
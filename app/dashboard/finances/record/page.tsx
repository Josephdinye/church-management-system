// app/(dashboard)/finances/record/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecordFinancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    memberId: '',
    type: 'Tithe',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Fetch members
  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.type) {
      alert("Please fill amount and type");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/finances/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: formData.memberId || null,
          type: formData.type,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.description.trim(),
        }),
      });

      if (res.ok) {
        alert(`✅ ₵${formData.amount} ${formData.type} recorded successfully!`);
        router.push('/dashboard/finances');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to record transaction');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '2rem' }}>
        Record New Contribution
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '620px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Member <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="">Select Member</option>
                {members.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.membershipNumber} — {m.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Contribution Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="Tithe">Tithe</option>
                <option value="Offering">Offering</option>
                <option value="Special Donation">Special Donation</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Amount (₵) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '18px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Note / Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Purpose or additional notes..."
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '90px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '2.5rem',
              width: '100%',
              padding: '16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Recording...' : 'Record Contribution'}
          </button>
        </div>
      </form>
    </div>
  );
}
// app/(dashboard)/members/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MemberTable from '@/components/members/member-table';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        console.error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            Church Members
          </h1>
          <p style={{ color: '#6b7280' }}>
            Total Members: <strong>{members.length}</strong> • 
            Showing: <strong>{filteredMembers.length}</strong>
          </p>
        </div>

        <Link href="/dashboard/members/new" style={{
          padding: '14px 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}>
          + Add New Member
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search by name, email or membership number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            minWidth: '320px',
            fontSize: '15px'
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'white',
            minWidth: '140px'
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={fetchMembers}
          style={{
            padding: '12px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Members Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Loading members...
        </div>
      ) : (
        <MemberTable members={filteredMembers} />
      )}

      {filteredMembers.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '5rem 2rem', 
          color: '#9ca3af',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '18px' }}>No members found matching your search criteria.</p>
          <p style={{ marginTop: '8px' }}>Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
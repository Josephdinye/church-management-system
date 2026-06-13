// app/(dashboard)/finances/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
  member?: {
    id: string;
    fullName: string;
    membershipNumber: string;
  };
};

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/finances');
      if (res.ok) {
        const data = await res.json();
        const txs = data.transactions || data || [];
        setTransactions(txs);
        setFilteredTransactions(txs);
      }
    } catch (error) {
      console.error('Failed to fetch finances:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  useEffect(() => {
    let result = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        (tx.member?.fullName?.toLowerCase().includes(term)) ||
        (tx.member?.membershipNumber?.toLowerCase().includes(term)) ||
        (tx.description?.toLowerCase().includes(term))
      );
    }

    if (typeFilter !== 'All') {
      result = result.filter(tx => tx.type === typeFilter);
    }

    setFilteredTransactions(result);
  }, [transactions, searchTerm, typeFilter]);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Church Finances
        </h1>
        <p style={{ color: '#6b7280' }}>Manage Tithes, Welfare, Offerings & Donations • Currency: Cedis (₵)</p>
      </div>

      {/* Quick Record Buttons */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/dashboard/finances/record?type=tithe" style={{
          padding: '16px 32px',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
        }}>
          + Record New Tithe & Welfare
        </Link>

        <Link href="/dashboard/finances/record?type=offering" style={{
          padding: '16px 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
        }}>
          + Record New Offering & Donation
        </Link>
      </div>

      {/* Reports Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '1rem' }}>Financial Reports</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/finances/member-report" style={{
            padding: '16px 32px',
            backgroundColor: 'white',
            border: '2px solid #4f46e5',
            color: '#4f46e5',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            📊 Member Financial History
          </Link>

          <Link href="/dashboard/finances/church-report" style={{
            padding: '16px 32px',
            backgroundColor: 'white',
            border: '2px solid #10b981',
            color: '#10b981',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            📈 Church Offerings & Contributions Report
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by name or membership number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            minWidth: '300px'
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px'
          }}
        >
          <option value="All">All Types</option>
          <option value="Tithe">Tithe</option>
          <option value="Welfare">Welfare</option>
          <option value="Offering">Offering</option>
          <option value="Donation">Donation</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Recent Transactions</h2>
          <p style={{ fontWeight: '600' }}>Total: ₵{totalAmount.toLocaleString()}</p>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Member</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount (₵)</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx: Transaction) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem' }}>{formatDate(tx.date)}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    {tx.member ? `${tx.member.membershipNumber} - ${tx.member.fullName}` : '—'}
                  </td>
                  <td style={{ padding: '1rem' }}>{tx.type}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                    {Number(tx.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}
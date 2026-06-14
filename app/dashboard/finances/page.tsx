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

  // Filter logic
  useEffect(() => {
    let result = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.member?.fullName?.toLowerCase().includes(term) ||
        tx.member?.membershipNumber?.toLowerCase().includes(term) ||
        tx.description?.toLowerCase().includes(term)
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
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
          fontWeight: '700', 
          marginBottom: '8px',
          color: '#1e3a8a'
        }}>
          Church Finances
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Manage Tithes, Offerings, Welfare, Donations & Expenses • Currency: Cedis (₵)
        </p>
      </div>

      {/* Quick Record Buttons */}
      <div style={{ 
        marginBottom: '3rem', 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap' 
      }}>
        <Link href="/dashboard/finances/record?type=tithe" style={{
          padding: '16px 28px',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          + Record New Tithe & Welfare
        </Link>

        <Link href="/dashboard/finances/record?type=offering" style={{
          padding: '16px 28px',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          + Record New Offering & Donation
        </Link>

        <Link href="/dashboard/finances/spending" style={{
          padding: '16px 28px',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Church Spending / Expense
        </Link>
      </div>

      {/* Financial Reports */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '1.2rem', color: '#1e3a8a' }}>
          Financial Reports
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/finances/member-report" style={{
            padding: '16px 32px',
            backgroundColor: 'white',
            border: '2px solid #4f46e5',
            color: '#4f46e5',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.2s'
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
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            📈 Church Offerings & Contributions Report
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'end'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search by member name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '14px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="All">All Types</option>
            <option value="Tithe">Tithe</option>
            <option value="Welfare">Welfare</option>
            <option value="Offering">Offering</option>
            <option value="Donation">Donation</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1.8rem 2rem', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>Recent Transactions</h2>
          <p style={{ fontWeight: '600', color: '#1e3a8a', margin: 0 }}>
            Total: ₵{totalAmount.toLocaleString()}
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No transactions found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1.1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1.1rem', textAlign: 'left', fontWeight: '600' }}>Member</th>
                  <th style={{ padding: '1.1rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '1.1rem', textAlign: 'right', fontWeight: '600' }}>Amount (₵)</th>
                  <th style={{ padding: '1.1rem', textAlign: 'left', fontWeight: '600' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx: Transaction) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.1rem' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '1.1rem', fontWeight: '500' }}>
                      {tx.member ? `${tx.member.membershipNumber} - ${tx.member.fullName}` : '—'}
                    </td>
                    <td style={{ padding: '1.1rem' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.9rem',
                        backgroundColor: tx.type === 'Expense' ? '#fee2e2' : '#ecfdf5',
                        color: tx.type === 'Expense' ? '#ef4444' : '#10b981'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1.1rem', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      color: tx.type === 'Expense' ? '#ef4444' : '#10b981' 
                    }}>
                      {Number(tx.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '1.1rem', color: '#64748b' }}>{tx.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
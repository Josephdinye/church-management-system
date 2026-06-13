'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
};

export default function MemberFinancialReport() {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Load members
  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, []);

  const fetchMemberTransactions = async (memberId: string) => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/finances?memberId=${memberId}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  useEffect(() => {
    let result = [...transactions];

    if (fromDate) {
      result = result.filter(t => new Date(t.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter(t => new Date(t.date) <= new Date(toDate));
    }
    if (typeFilter !== 'All') {
      result = result.filter(t => t.type === typeFilter);
    }

    setFilteredTransactions(result);
  }, [transactions, fromDate, toDate, typeFilter]);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const handlePrint = () => window.print();

  const selectedMember = members.find((m: any) => m.id === selectedMemberId);

  return (
    <>
      <style jsx global>{`
        @media print {
          * { visibility: hidden !important; }
          .print-container, .print-container * { visibility: visible !important; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 50px 70px !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-container" style={{ 
        padding: '40px 60px', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        background: 'white',
        fontFamily: 'Georgia, serif'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '4px solid #1e3a8a', paddingBottom: '25px' }}>
          <h1 style={{ fontSize: '36px', margin: '0', color: '#1e3a8a' }}>{churchConfig.name}</h1>
          <p style={{ margin: '8px 0', color: '#334155' }}>{churchConfig.address}</p>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e3a8a' }}>MEMBER FINANCIAL HISTORY</h2>

        {selectedMember && (
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: '600' }}>{selectedMember.fullName}</p>
            <p style={{ color: '#666' }}>{selectedMember.membershipNumber}</p>
          </div>
        )}

        {/* Filters */}
        <div className="no-print" style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'end'
        }}>
          <div>
            <label>Select Member</label><br />
            <select 
              value={selectedMemberId} 
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                fetchMemberTransactions(e.target.value);
              }} 
              style={{ width: '280px', padding: '10px', borderRadius: '8px' }}
            >
              <option value="">-- Select Member --</option>
              {members.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.membershipNumber} - {m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>From</label><br />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label>To</label><br />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <div>
            <label>Type</label><br />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <button 
            onClick={handlePrint} 
            style={{
              padding: '10px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Transactions Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Amount (₵)</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx: Transaction) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '14px' }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: '14px' }}>{tx.type}</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600' }}>
                  ₵{Number(tx.amount).toLocaleString()}
                </td>
                <td style={{ padding: '14px' }}>{tx.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '40px', textAlign: 'right', fontWeight: '600', fontSize: '18px' }}>
          Total: ₵{totalAmount.toLocaleString()}
        </div>
      </div>
    </>
  );
}
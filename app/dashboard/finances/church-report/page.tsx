//app(dashboard)/finances/church-report/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
  member?: { fullName: string };
};

export default function ChurchFinancialReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/finances')
      .then(res => res.json())
      .then(data => {
        const txs = data.transactions || data || [];
        setTransactions(txs);
        setFilteredTransactions(txs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...transactions];

    if (fromDate) result = result.filter(t => new Date(t.date) >= new Date(fromDate));
    if (toDate) result = result.filter(t => new Date(t.date) <= new Date(toDate));
    if (typeFilter !== 'All') {
      result = result.filter(t => t.type === typeFilter);
    }

    setFilteredTransactions(result);
  }, [transactions, fromDate, toDate, typeFilter]);

  // Category Totals (based on filtered data when printing)
  const categoryTotals = {
    All: filteredTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    Offering: filteredTransactions.filter(t => t.type === 'Offering').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    Tithe: filteredTransactions.filter(t => t.type === 'Tithe').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    Welfare: filteredTransactions.filter(t => t.type === 'Welfare').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    Donation: filteredTransactions.filter(t => t.type === 'Donation' || t.type === 'Donations').reduce((sum, t) => sum + Number(t.amount || 0), 0),
  };

  // Monthly Breakdown (based on filtered data)
  const monthlyBreakdown = filteredTransactions.reduce((acc: any, tx) => {
    const monthKey = new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = { total: 0, Offering: 0, Tithe: 0, Welfare: 0, Donation: 0 };
    }
    acc[monthKey].total += Number(tx.amount || 0);
    if (tx.type in acc[monthKey]) acc[monthKey][tx.type] += Number(tx.amount || 0);
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <>
      <style jsx global>{`
        @media print {
          * { visibility: hidden !important; }
          .print-container, .print-container * { visibility: visible !important; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px 60px !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-container" style={{ 
        padding: '40px 60px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        fontFamily: 'Georgia, serif',
        background: 'white'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '6px solid #1e3a8a', paddingBottom: '30px' }}>
          <h1 style={{ fontSize: '38px', margin: '0', color: '#1e3a8a' }}>
            {churchConfig.name}
          </h1>
          <p style={{ margin: '12px 0 4px 0', fontSize: '17px', color: '#334155' }}>
            {churchConfig.address}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#334155' }}>
            {churchConfig.email} • {churchConfig.phone}
          </p>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '8px' }}>
          CHURCH FINANCIAL REPORT
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>
          Offerings, Tithes, Welfare & Donations Summary
        </p>

        {/* FILTERS - FIRST THING TO SEE */}
        <div className="no-print" style={{ 
          backgroundColor: '#f8fafc', 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>From Date</label>
            <input 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>To Date</label>
            <input 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Record Type</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)} 
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '190px' }}
            >
              <option value="All">All Records</option>
              <option value="Offering">Offering Only</option>
              <option value="Tithe">Tithe Only</option>
              <option value="Welfare">Welfare Only</option>
              <option value="Donation">Donations Only</option>
            </select>
          </div>

          <button 
            onClick={handlePrint}
            style={{
              padding: '11px 32px',
              backgroundColor: '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Summary Cards - Filtered Totals */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px', 
          marginBottom: '40px' 
        }}>
          {[
            { label: 'TOTAL ALL', amount: categoryTotals.All, color: '#1e3a8a' },
            { label: 'OFFERINGS', amount: categoryTotals.Offering, color: '#166534' },
            { label: 'TITHES', amount: categoryTotals.Tithe, color: '#1e40af' },
            { label: 'WELFARE', amount: categoryTotals.Welfare, color: '#854d0e' },
            { label: 'DONATIONS', amount: categoryTotals.Donation, color: '#4338ca' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', marginBottom: '8px' }}>{item.label}</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: item.color }}>
                ₵{item.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Monthly Breakdown */}
        <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Monthly Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '50px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Month</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Total</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Offering</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Tithe</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Welfare</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Donation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyBreakdown).map(([month, data]: any) => (
              <tr key={month} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '14px', fontWeight: '500' }}>{month}</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600' }}>₵{data.total.toLocaleString()}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>₵{(data.Offering || 0).toLocaleString()}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>₵{(data.Tithe || 0).toLocaleString()}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>₵{(data.Welfare || 0).toLocaleString()}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>₵{(data.Donation || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detailed Transactions Table */}
        <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Detailed Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Description / Member</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Amount (₵)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '14px' }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: '14px', fontWeight: '500' }}>{tx.type}</td>
                <td style={{ padding: '14px' }}>{tx.member?.fullName || tx.description || '—'}</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600' }}>
                  ₵{Number(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ 
          textAlign: 'right', 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#1e3a8a',
          marginTop: '20px'
        }}>
          Grand Total: ₵{categoryTotals.All.toLocaleString()}
        </div>

        <div style={{ textAlign: 'center', marginTop: '90px', borderTop: '1px dashed #94a3b8', paddingTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            This financial report is officially issued by {churchConfig.name} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
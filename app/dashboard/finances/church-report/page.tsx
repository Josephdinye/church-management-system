'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

export default function ChurchFinancialReport() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/finances')
      .then(res => res.json())
      .then(data => {
        setTransactions(data.transactions || []);
        setFilteredTransactions(data.transactions || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
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

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const handlePrint = () => window.print();

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
        padding: '50px 70px', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        fontFamily: 'Georgia, serif',
        background: 'white'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '50px', borderBottom: '5px solid #1e3a8a', paddingBottom: '35px' }}>
          <img src={churchConfig.logo} alt="Logo" style={{ height: '90px', marginBottom: '15px' }} />
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

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '10px' }}>
          CHURCH FINANCIAL REPORT
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>
          Offerings, Tithes, Welfare & Donations Summary
        </p>

        {/* Filters - Visible on screen only */}
        <div className="no-print" style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          alignItems: 'end'
        }}>
          <div>
            <label>From Date</label><br />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label>To Date</label><br />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div>
            <label>Record Type</label><br />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="All">All Records</option>
              <option value="Tithe">Tithe Only</option>
              <option value="Welfare">Welfare Only</option>
              <option value="Offering">Offering Only</option>
              <option value="Donation">Donation Only</option>
            </select>
          </div>

          <button 
            onClick={handlePrint}
            style={{
              padding: '10px 28px',
              backgroundColor: '#4f46e5',
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

        {/* Summary Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Member / Description</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Amount (₵)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx: any) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px' }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>{tx.type}</td>
                <td style={{ padding: '16px' }}>
                  {tx.member ? tx.member.fullName : tx.description || '—'}
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>
                  ₵{Number(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ 
          textAlign: 'right', 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1e3a8a',
          marginTop: '20px'
        }}>
          Grand Total: ₵{totalAmount.toLocaleString()}
        </div>

        <div style={{ textAlign: 'center', marginTop: '80px', borderTop: '1px dashed #94a3b8', paddingTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            This financial report is officially issued by {churchConfig.name} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
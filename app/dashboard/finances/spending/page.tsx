// app/dashboard/finances/spending/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

type Expense = {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
};

export default function SpendingPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'General',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/finances');
      const data = await res.json();
      const allExpenses = (data.transactions || data).filter((t: any) => t.type === 'Expense');
      setExpenses(allExpenses);
      setFilteredExpenses(allExpenses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  useEffect(() => {
    let result = [...expenses];

    if (fromDate) result = result.filter(exp => new Date(exp.date) >= new Date(fromDate));
    if (toDate) result = result.filter(exp => new Date(exp.date) <= new Date(toDate));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(exp => 
        exp.description.toLowerCase().includes(term) ||
        (exp.category && exp.category.toLowerCase().includes(term))
      );
    }

    setFilteredExpenses(result);
  }, [expenses, fromDate, toDate, searchTerm]);

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Expense',
          description: formData.description,
          amount: Number(formData.amount),
          date: formData.date,
          category: formData.category,
        }),
      });

      if (res.ok) {
        setFormData({
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          category: 'General',
        });
        fetchExpenses(); // Refresh the list
      }
    } catch (error) {
      alert('Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

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
        padding: 'clamp(20px, 6vw, 40px) clamp(15px, 5vw, 60px)', 
        maxWidth: '1100px', 
        margin: '0 auto', 
        background: 'white',
        fontFamily: 'Georgia, serif'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '5px solid #1e3a8a', paddingBottom: '30px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 7vw, 38px)', margin: '0', color: '#1e3a8a' }}>
            {churchConfig.name}
          </h1>
          <p style={{ margin: '12px 0 4px 0', fontSize: 'clamp(15px, 4vw, 17px)', color: '#334155' }}>
            {churchConfig.address}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#334155' }}>
            {churchConfig.email} • {churchConfig.phone}
          </p>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '8px', fontSize: 'clamp(22px, 5.5vw, 28px)' }}>
          CHURCH SPENDING REPORT
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '35px', color: '#555', fontSize: 'clamp(15px, 4vw, 17px)' }}>
          Record & Manage All Church Expenses
        </p>

        {/* ===================== RECORD FORM - FIRST ===================== */}
        <div className="no-print" style={{ 
          background: '#f8fafc', 
          padding: 'clamp(1.5rem, 5vw, 2rem)', 
          borderRadius: '12px', 
          marginBottom: '40px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '1.8rem', color: '#1e3a8a', textAlign: 'center', fontSize: 'clamp(20px, 5vw, 24px)' }}>
            Record New Spending
          </h3>
          
          <form onSubmit={handleSubmit} style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '1.5rem' 
          }} className="spending-form">
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Date</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Description</label>
              <input 
                type="text" 
                placeholder="Electricity bill, cleaning materials..." 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                required 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Amount (₵)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                required 
                step="0.01" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}}
              >
                <option value="General">General</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent / Venue</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Outreach">Outreach</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{
                gridColumn: '1 / -1',
                padding: '16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1.1rem',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Recording Expense...' : 'Record Spending'}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="no-print" style={{ 
          backgroundColor: '#f8fafc', 
          padding: 'clamp(16px, 4vw, 20px)', 
          borderRadius: '12px', 
          marginBottom: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'end'
        }}>
          <div style={{ flex: '1 1 180px' }}>
            <label>From Date</label><br />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label>To Date</label><br />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: '1 1 280px' }}>
            <label>Search</label><br />
            <input 
              type="text" 
              placeholder="Search description..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} 
            />
          </div>

          <button onClick={handlePrint} style={{
            padding: '12px 32px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            🖨️ Print Report
          </button>
        </div>

        {/* Summary */}
        <div style={{ textAlign: 'right', fontSize: 'clamp(22px, 5.5vw, 26px)', fontWeight: '700', color: '#1e3a8a', marginBottom: '25px' }}>
          Total Spending: ₵{totalExpenses.toLocaleString()}
        </div>

        {/* Spending Report Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Amount (₵)</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>{exp.description}</td>
                  <td style={{ padding: '16px' }}>{exp.category || 'General'}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>
                    ₵{Number(exp.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: '80px', borderTop: '1px dashed #94a3b8', paddingTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            This report was generated by {churchConfig.name} on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Mobile Form Grid */}
      <style jsx>{`
        @media (min-width: 768px) {
          .spending-form {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
          }
        }
      `}</style>
    </>
  );
}
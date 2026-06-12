'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { churchConfig } from '@/lib/config';

export default function AttendanceHistoryPage() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');
  
  const [member, setMember] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (memberId) fetchHistory();
  }, [memberId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [memberRes, historyRes] = await Promise.all([
        fetch(`/api/members/${memberId}`),
        fetch(`/api/attendance?memberId=${memberId}`)
      ]);

      if (memberRes.ok) setMember(await memberRes.json());
      if (historyRes.ok) {
        const data = await historyRes.json();
        const sorted = (data.attendances || []).sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setHistory(sorted);
        setFilteredHistory(sorted);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Date range filter
  useEffect(() => {
    let result = [...history];

    if (fromDate) {
      result = result.filter(att => new Date(att.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter(att => new Date(att.date) <= new Date(toDate));
    }

    setFilteredHistory(result);
  }, [history, fromDate, toDate]);

  const handlePrint = () => window.print();

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading attendance history...</div>;
  if (!member) return <div>Member not found.</div>;

  return (
    <>
      <style jsx global>{`
        @media print {
          * { visibility: hidden !important; }
          .print-container, .print-container * { visibility: visible !important; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px 60px !important; }
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
        }
      `}</style>

      <div className="print-container" style={{ 
        padding: '60px 80px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        fontFamily: 'Georgia, serif',
        background: 'white',
        lineHeight: '1.6'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '50px', borderBottom: '4px solid #1e3a8a', paddingBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', margin: '0', color: '#1e3a8a' }}> 
             {churchConfig.name}</h1>
          <p style={{ margin: '12px 0 0 0', color: '#334155' }}>
            {churchConfig.address}
          </p>
          <p style={{ margin: '12px 0 0 0', color: '#334155' }}>
            E-mail: {churchConfig.email} • Phone: {churchConfig.phone}
          </p>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '10px' }}>ATTENDANCE HISTORY</h2>
        <p style={{ textAlign: 'center', fontSize: '22px', marginBottom: '40px', fontWeight: '600' }}>
          {member.membershipNumber} — {member.fullName}
        </p>

        {/* Date Filter - Screen Only */}
        <div className="no-print" style={{ marginBottom: '30px', textAlign: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <label style={{ marginRight: '10px' }}>From:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ marginRight: '15px' }} />
          <label style={{ marginRight: '10px' }}>To:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ marginRight: '15px' }} />
          <button onClick={() => {setFromDate(''); setToDate('');}} style={{ padding: '6px 12px' }}>Reset</button>
        </div>

        {/* Attendance Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '60px' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((att: any) => (
              <tr key={att.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px' }}>
                  {new Date(att.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    backgroundColor: att.status === 'Present' ? '#ecfdf5' : '#fef2f2',
                    color: att.status === 'Present' ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {att.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>{att.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'center', borderTop: '1px dashed #94a3b8', paddingTop: '30px', marginTop: '60px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            This document is officially issued by {churchConfig.name} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Print Button - Visible only on screen */}
      <div className="no-print" style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100 }}>
        <button 
          onClick={handlePrint}
          style={{
            padding: '14px 36px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          🖨️ Print Attendance History
        </button>
      </div>
    </>
  );
}
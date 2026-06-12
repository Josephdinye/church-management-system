// app/dashboard/attendance/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
        const sorted = (data.attendances || []).sort((a, b) => 
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

  // Filter by date range
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

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!member) return <div>Member not found.</div>;

  return (
    <>
      <style jsx global>{`
        @media print {
          * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-container" style={{ 
        padding: '60px 80px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        fontFamily: 'Georgia, serif',
        background: 'white'
      }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', marginBottom: '50px', borderBottom: '4px solid #1e3a8a', paddingBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', margin: '0', color: '#1e3a8a' }}>GRACE COMMUNITY CHURCH</h1>
          <p style={{ margin: '12px 0 0 0', color: '#334155' }}>
            123 Faith Avenue • Springfield • (555) 123-4567
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#64748b' }}>
            Established 1995 | Serving with Love
          </p>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '20px' }}>ATTENDANCE HISTORY</h2>
        <p style={{ textAlign: 'center', fontSize: '22px', marginBottom: '40px', fontWeight: '600' }}>
          {member.membershipNumber} — {member.fullName}
        </p>

        {/* Date Range Filter - Visible on screen only */}
        <div className="no-print" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <label>From: </label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ margin: '0 10px' }} />
          <label>To: </label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ margin: '0 10px' }} />
          <button onClick={() => {setFromDate(''); setToDate('');}} style={{ marginLeft: '15px' }}>Reset</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid #1e3a8a' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Notes</th>
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
                    padding: '8px 22px',
                    borderRadius: '9999px',
                    backgroundColor: att.status === 'Present' ? '#ecfdf5' : '#fef2f2',
                    color: att.status === 'Present' ? '#10b981' : '#ef4444'
                  }}>
                    {att.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#6b7280' }}>{att.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px dashed #94a3b8', paddingTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            This document is officially issued by Grace Community Church • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print" style={{ position: 'fixed', bottom: '40px', right: '40px' }}>
        <button 
          onClick={handlePrint}
          style={{
            padding: '14px 32px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🖨️ Print History
        </button>
      </div>
    </>
  );
}
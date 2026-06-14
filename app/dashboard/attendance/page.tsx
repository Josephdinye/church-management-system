'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  status: string;
  notes?: string;
  createdAt: string;
};

export default function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, attRes] = await Promise.all([
        fetch('/api/members'),
        fetch(`/api/attendance?date=${selectedDate}`)
      ]);

      if (membersRes.ok) setMembers(await membersRes.json());
      if (attRes.ok) {
        const data = await attRes.json();
        setAttendanceRecords(data.attendances || []);
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (memberId: string, status: string) => {
    if (selectedDate > today) {
      alert("❌ You cannot mark attendance for future dates.");
      return;
    }

    try {
      const existingRecord = attendanceRecords.find((a: AttendanceRecord) => a.memberId === memberId);
      
      if (existingRecord) {
        const hoursDiff = (new Date().getTime() - new Date(existingRecord.createdAt).getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 1) {
          alert("❌ This attendance record is locked (more than 1 hour old).");
          return;
        }
      }

      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          date: selectedDate,
          status,
        }),
      });
      
      fetchData();
    } catch (error) {
      alert('Failed to mark attendance');
    }
  };

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.membershipNumber && member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .att-member-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            padding: 1rem !important;
          }
          .att-actions {
            width: 100% !important;
            justify-content: flex-start !important;
            flex-wrap: wrap !important;
          }
          .att-summary {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              Attendance
            </h1>
            <p style={{ color: '#6b7280' }}>
              Mark and track service attendance • Future dates are locked
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: '500', marginRight: '12px' }}>Service Date:</label>
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Summary */}
        <div className="att-summary" style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ color: '#6b7280' }}>Present Today</p>
            <p style={{ fontSize: '42px', fontWeight: '700', color: '#10b981' }}>
              {presentCount} / {members.length}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280' }}>Attendance Rate</p>
            <p style={{ fontSize: '42px', fontWeight: '700' }}>
              {members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or membership number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '14px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}
        />

        {/* Attendance List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center' }}>Loading attendance...</p>
          ) : (
            filteredMembers.map((member: any) => {
              const record = attendanceRecords.find((a: AttendanceRecord) => a.memberId === member.id);
              const currentStatus = record?.status || 'Not Marked';
              const isLocked = record && 
                (new Date().getTime() - new Date(record.createdAt).getTime()) / (1000 * 60 * 60) > 1;

              return (
                <div key={member.id} className="att-member-row" style={{
                  padding: '1.25rem 2rem',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #e5e7eb',
                      backgroundColor: '#f8fafc',
                      flexShrink: 0
                    }}>
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.fullName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e0e7ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          color: '#4f46e5',
                          fontWeight: 'bold'
                        }}>
                          {member.fullName?.[0] || '👤'}
                        </div>
                      )}
                    </div>

                    <div>
                      <p style={{ fontWeight: '600' }}>{member.fullName}</p>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>{member.membershipNumber}</p>
                    </div>
                  </div>

                  <div className="att-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => markAttendance(member.id, 'Present')}
                      disabled={isLocked || selectedDate > today}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: currentStatus === 'Present' ? '#10b981' : '#e5e7eb',
                        color: currentStatus === 'Present' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '9999px',
                        fontWeight: '500',
                        cursor: (isLocked || selectedDate > today) ? 'not-allowed' : 'pointer',
                        opacity: (isLocked || selectedDate > today) ? 0.6 : 1
                      }}
                    >
                      Present
                    </button>

                    <button
                      onClick={() => markAttendance(member.id, 'Absent')}
                      disabled={isLocked || selectedDate > today}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: currentStatus === 'Absent' ? '#ef4444' : '#e5e7eb',
                        color: currentStatus === 'Absent' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '9999px',
                        fontWeight: '500',
                        cursor: (isLocked || selectedDate > today) ? 'not-allowed' : 'pointer',
                        opacity: (isLocked || selectedDate > today) ? 0.6 : 1
                      }}
                    >
                      Absent
                    </button>

                    <Link 
                      href={`/dashboard/attendance/history?memberId=${member.id}`}
                      style={{ 
                        color: '#4f46e5', 
                        marginLeft: '16px', 
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      View History →
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
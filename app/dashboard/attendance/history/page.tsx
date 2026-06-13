// app/dashboard/attendance/history/page.tsx
'use client';

import { Suspense } from 'react';
import AttendanceHistoryContent from './AttendanceHistoryContent';

export default function AttendanceHistoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading attendance history...</div>}>
      <AttendanceHistoryContent />
    </Suspense>
  );
}
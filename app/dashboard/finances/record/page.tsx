// app/dashboard/finances/record/page.tsx
import { Suspense } from 'react';
import RecordFinanceContent from './RecordFinanceContent';

export default function RecordFinancePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '100px', textAlign: 'center', fontSize: '18px' }}>
        Loading contribution form...
      </div>
    }>
      <RecordFinanceContent />
    </Suspense>
  );
}
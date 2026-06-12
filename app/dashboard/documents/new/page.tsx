'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDocumentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    memberId: '',
  });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError('');

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('category', formData.category);
    if (formData.memberId) uploadFormData.append('memberId', formData.memberId);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Document uploaded successfully!');
        router.push('/dashboard/documents');
        router.refresh();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Upload New Document
        </h1>
        <p style={{ color: '#6b7280' }}>Upload church documents, reports, or files to Cloudflare R2</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Document Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Financial Report Q2 2026"
                required
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="General">General</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="Schedule">Schedule</option>
                <option value="Handbook">Handbook</option>
                <option value="Report">Report</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Attach to Member (Optional)
              </label>
              <input
                type="text"
                placeholder="Member ID (optional)"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                File *
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                Supported: PDF, Word, Excel, Images (Max 10MB)
              </p>
            </div>

            {error && (
              <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !file}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string; title: string} | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const openDeleteModal = (id: string, title: string) => {
    setDocumentToDelete({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      const res = await fetch(`/api/documents?id=${documentToDelete.id}`, { 
        method: 'DELETE' 
      });
      
      if (res.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .docs-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .docs-upload-btn {
            width: 100% !important;
            text-align: center !important;
            border-radius: 8px !important;
          }
          .docs-table-wrap {
            overflow-x: auto !important;
          }
          .docs-table {
            min-width: 580px !important;
          }
          .docs-modal {
            width: 90vw !important;
          }
        }
      `}</style>

      <div>
        <div className="docs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              Church Documents
            </h1>
            <p style={{ color: '#6b7280' }}>Manage all uploaded files and reports</p>
          </div>

          <Link 
            href="/dashboard/documents/new"
            className="docs-upload-btn"
            style={{
              padding: '14px 28px',
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            + Upload New Document
          </Link>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', minWidth: '200px' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Finance">Finance</option>
            <option value="Legal">Legal</option>
            <option value="Schedule">Schedule</option>
            <option value="Report">Report</option>
          </select>

          <button onClick={fetchDocuments} style={{ padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
            Refresh
          </button>
        </div>

        {/* Documents List */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '4rem' }}>Loading documents...</p>
        ) : (
          <div className="docs-table-wrap" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table className="docs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Document Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Uploaded</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{doc.title}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                        {(doc.fileSize / (1024*1024)).toFixed(2)} MB
                      </p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '6px 14px', backgroundColor: '#f0f9ff', color: '#3b82f6', borderRadius: '9999px', fontSize: '14px' }}>
                        {doc.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#4f46e5', marginRight: '16px', textDecoration: 'none', fontWeight: '500' }}
                      >
                        📄 View / Download
                      </a>
                      <button 
                        onClick={() => openDeleteModal(doc.id, doc.title)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDocuments.length === 0 && (
              <p style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                No documents found.
              </p>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && documentToDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="docs-modal" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '420px',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Delete Document?</h3>
              <p>Are you sure you want to delete <strong>"{documentToDelete.title}"</strong>?</p>
              <p style={{ color: '#ef4444', marginTop: '1rem', fontWeight: '600' }}>
                This action cannot be undone.
              </p>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => { setShowDeleteModal(false); setDocumentToDelete(null); }}
                  style={{ padding: '12px 28px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  style={{ padding: '12px 28px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
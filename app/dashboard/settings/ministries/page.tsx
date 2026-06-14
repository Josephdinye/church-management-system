// app/(dashboard)/settings/ministries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

type Ministry = {
  id: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
};

export default function MinistriesSettings() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // For nice confirmation

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const res = await fetch('/api/ministries');
      const data = await res.json();
      setMinistries(data);
    } catch (error) {
      console.error('Failed to fetch ministries', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    
    if (selectedFile) {
      form.append('image', selectedFile);
    }

    try {
      const res = await fetch('/api/ministries', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        showMessage('success', 'Ministry added successfully!');
        fetchMinistries();
        resetForm();
      } else {
        showMessage('error', 'Failed to save ministry');
      }
    } catch (error) {
      showMessage('error', 'Failed to save ministry');
    }
  };

  const requestDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/ministries?id=${confirmDelete}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Ministry deleted successfully');
        fetchMinistries();
      } else {
        showMessage('error', 'Failed to delete ministry');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete ministry');
    } finally {
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>
        Manage Ministries
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        These ministries will appear on the public Ministries page
      </p>

      {message && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: message.type === 'success' ? '#166534' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? '#86efac' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '2rem' }}>
              Are you sure you want to delete this ministry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={cancelDelete}
                style={{ padding: '12px 24px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteAction}
                style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Ministry Form */}
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        marginBottom: '3rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Ministry</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Ministry Image <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              required
              style={{ marginBottom: '12px' }}
            />
            {previewUrl && (
              <div style={{ marginTop: '12px' }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxHeight: '240px', borderRadius: '8px', border: '1px solid #ddd' }} 
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ministry Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit"
            style={{ 
              padding: '14px 32px', 
              background: '#1e3a8a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            Add Ministry
          </button>
        </form>
      </div>

      {/* Current Ministries List */}
      <h2 style={{ marginBottom: '1.5rem' }}>Current Ministries ({ministries.length})</h2>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {ministries.map((ministry) => (
          <div key={ministry.id} style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            {ministry.image && (
              <img 
                src={ministry.image} 
                alt={ministry.title}
                style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              />
            )}
            
            <div style={{ padding: '1.8rem' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.6rem', color: '#1e3a8a' }}>
                {ministry.title}
              </h3>
              <p style={{ margin: 0, lineHeight: '1.75', color: '#374151' }}>
                {ministry.description}
              </p>

              <div style={{ marginTop: '1.8rem' }}>
                <button 
                  onClick={() => requestDelete(ministry.id)} 
                  style={{ 
                    padding: '10px 22px', 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Delete Ministry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
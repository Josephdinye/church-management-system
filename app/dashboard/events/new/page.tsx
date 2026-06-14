// app/(dashboard)/events/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Worship',
    description: '',
    expectedAttendees: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const form = new FormData();
      
      form.append('title', formData.title);
      form.append('date', formData.date);
      form.append('time', formData.time);
      form.append('location', formData.location);
      form.append('type', formData.type);
      form.append('description', formData.description);
      form.append('expectedAttendees', formData.expectedAttendees);

      if (selectedImage) {
        form.append('image', selectedImage);
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();

      if (res.ok) {
        alert(`✅ Event "${formData.title}" created successfully!`);
        router.push('/dashboard/events');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create event');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Create New Event
        </h1>
        <p style={{ color: '#6b7280', fontSize: '17px' }}>
          Add a new church service, meeting, or special program.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '16px 20px',
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '1px solid #fecaca'
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          {/* Image Upload - Optional */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Event Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '12px' }}
            />
            {previewUrl && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxHeight: '220px', borderRadius: '8px', border: '1px solid #ddd' }} 
                />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Event Title <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Time <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Location <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="Worship">Worship Service</option>
                <option value="Bible Study">Bible Study</option>
                <option value="Prayer">Prayer Meeting</option>
                <option value="Special">Special Event</option>
                <option value="Youth">Youth Program</option>
                <option value="Outreach">Outreach</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Expected Attendees
              </label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '2.5rem',
              width: '100%',
              padding: '16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
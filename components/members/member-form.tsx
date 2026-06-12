// components/members/member-form.tsx
'use client';

import { useState } from 'react';

interface MemberFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function MemberForm({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false,
  isEdit = false 
}: MemberFormProps) {

  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || 'Ghana',
    status: initialData.status || 'Active',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(initialData.photo || '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    let photoUrl = initialData.photo || '';

    // Upload new photo if selected
    if (photo) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', photo);
        formDataUpload.append('folder', 'members');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const result = await res.json();

        if (res.ok && result.url) {
          photoUrl = result.url;
        } else {
          throw new Error(result.error || 'Photo upload failed');
        }
      } catch (error) {
        console.error(error);
        alert("❌ Failed to upload photo. Please try again.");
        setUploading(false);
        return;
      }
    }

    const dataToSubmit = { 
      ...formData, 
      photo: photoUrl 
    };

    onSubmit(dataToSubmit);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>
          {isEdit ? 'Edit Member Information' : 'Register New Member'}
        </h2>

        {/* Photo Upload */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
            Member Photo <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            border: '4px solid #e5e7eb',
            margin: '0 auto 15px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
          }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: '55px', paddingTop: '45px', color: '#cbd5e1' }}>👤</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            required={!isEdit && !initialData.photo}
            style={{ margin: '0 auto', display: 'block' }}
          />
          <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
            Recommended: Square photo (JPG or PNG, max 5MB)
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name <span style={{color:'red'}}>*</span></label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} required style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Date of Birth</label>
            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>City</label>
            <input name="city" value={formData.city} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Country</label>
            <input name="country" value={formData.country} onChange={handleChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || uploading}
          style={{
            marginTop: '2.5rem',
            width: '100%',
            padding: '16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (isLoading || uploading) ? 'not-allowed' : 'pointer',
            opacity: (isLoading || uploading) ? 0.7 : 1
          }}
        >
          {uploading ? 'Uploading Photo...' : isLoading ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
        </button>
      </div>
    </form>
  );
}
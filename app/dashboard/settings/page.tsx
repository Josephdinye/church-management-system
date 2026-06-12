'use client';

import { useState, useEffect } from 'react';
import { churchConfig } from '@/lib/config';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('church');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Church Information
  const [churchInfo, setChurchInfo] = useState({
    name: churchConfig.name,
    shortName: churchConfig.shortName,
    address: churchConfig.address,
    phone: churchConfig.phone,
    email: churchConfig.email,
  });

  // System Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    publicDirectory: false,
    autoBackup: true,
    printHeader: true,
  });

  // Load existing settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setChurchInfo({
            name: data.name,
            shortName: data.shortName || churchConfig.shortName,
            address: data.address || churchConfig.address,
            phone: data.phone || churchConfig.phone,
            email: data.email || churchConfig.email,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleChurchSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchInfo),
      });

      if (res.ok) {
        setSuccessMessage("✅ Church information saved successfully!");
      } else {
        setSuccessMessage("❌ Failed to save church information");
      }
    } catch (error) {
      setSuccessMessage("❌ Network error occurred");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handlePreferencesSave = async () => {
    setIsSaving(true);
    try {
      // For now, we're saving preferences to the same endpoint (you can expand later)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...churchInfo,
          preferences: preferences
        }),
      });

      if (res.ok) {
        setSuccessMessage("✅ System preferences saved successfully!");
      } else {
        setSuccessMessage("❌ Failed to save preferences");
      }
    } catch (error) {
      setSuccessMessage("❌ Network error occurred");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your church information and system preferences
        </p>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: successMessage.includes('✅') ? '#ecfdf5' : '#fee2e2',
          color: successMessage.includes('✅') ? '#10b981' : '#ef4444',
          padding: '14px 20px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: '500'
        }}>
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('church')} style={{
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: activeTab === 'church' ? '#4f46e5' : '#f3f4f6',
          color: activeTab === 'church' ? 'white' : '#374151',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Church Information
        </button>
        <button onClick={() => setActiveTab('preferences')} style={{
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: activeTab === 'preferences' ? '#4f46e5' : '#f3f4f6',
          color: activeTab === 'preferences' ? 'white' : '#374151',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          System Preferences
        </button>
      </div>

      {/* Church Information Tab */}
      {activeTab === 'church' && (
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '2rem' }}>Church Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Church Name</label>
              <input 
                type="text" 
                value={churchInfo.name}
                onChange={(e) => setChurchInfo({...churchInfo, name: e.target.value})}
                style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Short Name</label>
              <input 
                type="text" 
                value={churchInfo.shortName}
                onChange={(e) => setChurchInfo({...churchInfo, shortName: e.target.value})}
                style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Address</label>
              <textarea 
                value={churchInfo.address}
                onChange={(e) => setChurchInfo({...churchInfo, address: e.target.value})}
                style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', minHeight: '90px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
              <input 
                type="text" 
                value={churchInfo.phone}
                onChange={(e) => setChurchInfo({...churchInfo, phone: e.target.value})}
                style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                value={churchInfo.email}
                onChange={(e) => setChurchInfo({...churchInfo, email: e.target.value})}
                style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
          </div>

          <button 
            onClick={handleChurchSave}
            disabled={isSaving}
            style={{
              marginTop: '2.5rem',
              padding: '14px 36px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Church Information'}
          </button>
        </div>
      )}

      {/* System Preferences Tab */}
      {activeTab === 'preferences' && (
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '2rem' }}>System Preferences</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { key: 'emailNotifications', label: "Email Notifications", desc: "Send service reminders and event updates" },
              { key: 'smsNotifications', label: "SMS Notifications", desc: "Enable text messages for members" },
              { key: 'publicDirectory', label: "Public Member Directory", desc: "Allow members to view basic profiles" },
              { key: 'autoBackup', label: "Automatic Database Backup", desc: "Weekly automatic backup" },
              { key: 'printHeader', label: "Print Header on Reports", desc: "Include logo and church details on printed reports" },
            ].map((item) => (
              <div key={item.key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ color: '#6b7280', fontSize: '14.5px' }}>{item.desc}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences[item.key as keyof typeof preferences]}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    [item.key]: e.target.checked
                  })}
                  style={{ width: '22px', height: '22px' }} 
                />
              </div>
            ))}
          </div>

          <button 
            onClick={handlePreferencesSave}
            disabled={isSaving}
            style={{
              marginTop: '2.5rem',
              padding: '14px 36px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
}
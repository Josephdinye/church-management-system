'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;
  const isAdmin = user?.role === 'ADMIN';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string; name: string} | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/users', {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingUser?.id
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(editingUser 
          ? `✅ ${formData.name} updated successfully!` 
          : `✅ ${formData.name} created successfully!`
        );
        resetForm();
        fetchUsers();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const openDeleteModal = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMessage(`✅ ${userToDelete.name} has been deleted.`);
        fetchUsers();
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
    setEditingUser(null);
    setShowForm(false);
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Loading users...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>User Management</h1>
          <p style={{ color: '#6b7280' }}>Manage church staff and administrators</p>
        </div>

        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            style={{
              padding: '12px 28px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + New User
          </button>
        )}
      </div>

      {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '14px', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {successMessage && <div style={{ color: '#10b981', background: '#d1fae5', padding: '14px', borderRadius: '8px', marginBottom: '1rem' }}>{successMessage}</div>}

      {/* Create/Edit Form */}
      {showForm && isAdmin && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingUser ? 'Edit User' : 'Create New User'}</h2>
          <form onSubmit={handleSubmit}>
            {/* ... your existing form ... */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label>Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              </div>
              <div>
                <label>Email Address *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              </div>
              <div>
                <label>{editingUser ? 'New Password (optional)' : 'Password *'}</label>
                <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              </div>
              <div>
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db'}}>
                  <option value="ADMIN">Admin</option>
                  <option value="PASTOR">Pastor</option>
                  <option value="TREASURER">Treasurer</option>
                  <option value="MEMBER">Member</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ padding: '14px 32px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' }}>
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button type="button" onClick={resetForm} style={{ padding: '14px 32px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '9999px' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Created</th>
              {isAdmin && <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '6px 16px', borderRadius: '9999px', background: '#e0f2fe', color: '#0369a1', fontSize: '14px' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                {isAdmin && (
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => handleEdit(user)} style={{ color: '#4f46e5', marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(user.id, user.name)} 
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
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
            width: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
            <p style={{ color: '#ef4444', fontWeight: '600', marginTop: '1rem' }}>
              This action cannot be undone.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                style={{ padding: '12px 24px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
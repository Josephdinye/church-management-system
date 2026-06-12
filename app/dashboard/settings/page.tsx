// app/(dashboard)/settings/page.tsx
export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your church system preferences and information.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', 
        gap: '2rem' 
      }}>

        {/* Church Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '1.5rem' }}>
            Church Information
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Church Name</label>
              <input 
                type="text" 
                defaultValue="Grace Community Church" 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Pastor Name</label>
              <input 
                type="text" 
                defaultValue="Pastor John Smith" 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Address</label>
              <textarea 
                defaultValue="123 Faith Street, Springfield" 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', minHeight: '80px' }}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '1.5rem' }}>
            System Preferences
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: "Email Notifications", desc: "Send service reminders and updates" },
              { label: "SMS Notifications", desc: "Enable text messages for members" },
              { label: "Public Directory", desc: "Allow members to view other members" },
              { label: "Auto Backup", desc: "Weekly automatic database backup" },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '500' }}>{item.label}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <button style={{
          padding: '14px 36px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Save All Changes
        </button>
      </div>
    </div>
  );
}
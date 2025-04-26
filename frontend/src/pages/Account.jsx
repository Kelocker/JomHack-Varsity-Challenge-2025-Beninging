import React from 'react';

const Account = ({ lang, language, changeLang }) => {
  return (
    <div>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>👤 Account</h2>
      <p style={{ color: '#555' }}>Welcome back, [Your Name]!</p>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Email:</strong> you@example.com</p>
        <p><strong>Plan:</strong> Free Tier</p>
        <p><strong>Member Since:</strong> Jan 2024</p>
        <div style={{ textAlign: 'right', padding: '0.5rem 1rem' }}>
        <select value={language} onChange={(e) => changeLang(e.target.value)}>
          <option value="en">EN</option>
          <option value="ms">BM</option>
          <option value="zh">中文</option>
        </select>
      </div>
      </div>
    </div>
  );
};

export default Account;

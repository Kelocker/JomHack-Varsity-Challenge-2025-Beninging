import React from 'react';

const Account = ({ lang, language, changeLang }) => {
  return (
    <div style={styles.wrapper}>
      {/* Top Section */}
      <h2 style={styles.heading}>👤 {lang.account}</h2>
      <p style={styles.subtext}>{lang.welcome}, <strong>User</strong>!</p>

      {/* Account Info Card */}
      <div style={styles.card}>
        <div style={styles.infoRow}>
          <span style={styles.label}>📧 {lang.email}:</span>
          <span style={styles.value}>you@example.com</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>⭐ {lang.plan}:</span>
          <span style={styles.value}>{lang.freeTier}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>📅 {lang.memberSince}:</span>
          <span style={styles.value}>Jan 2024</span>
        </div>
      </div>

      {/* Language Selection */}
      <div style={styles.languageSection}>
        <label style={styles.languageLabel}>🌐 {lang.language}:</label>
        <select
          value={language}
          onChange={(e) => changeLang(e.target.value)}
          style={styles.languageSelect}
        >
          <option value="en">EN</option>
          <option value="ms">BM</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </div>
  );
};


const styles = {
  wrapper: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#ff6f61',
  },
  subtext: {
    color: '#777',
    fontSize: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    color: '#666',
  },
  languageSection: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  languageLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#444',
  },
  languageSelect: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    fontSize: '1rem',
  },
};

export default Account;
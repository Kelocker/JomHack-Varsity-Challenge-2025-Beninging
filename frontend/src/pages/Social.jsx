import React from 'react';

const Social = () => {
  return (
    <div style={styles.wrapper}>
      {/* Top Section */}
      <h2 style={styles.heading}>🌐 Nearby Listings</h2>

      {/* Search Bar and Filter Icon */}
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search for food..."
          style={styles.searchInput}
        />
        <button style={styles.filterButton}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/107/107799.png" 
            alt="Filter"
            style={styles.filButton}
          />
        </button>
      </div>
      
      {/*Upload Post & View My Post*/}
      <div style={styles.buttonFrame}>
        <button style={styles.button}>Upload Post</button>
        <button style={styles.button}>View My Post</button>
      </div>

      {/* Post 1*/}
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <h3 style={styles.title}>Fresh Eggs</h3>
          <div style={styles.photo}>
            <img 
              src="https://market.borong.com/product-images/c0c4e56292ff013a1228c324ac6ac2f19d6d6130.jpg" 
              alt="Fresh Eggs" 
              style={styles.photo}
            />
          </div>
        </div>
        <div style={styles.desRow}>
          <span style={styles.label}>📝 Description: </span>
          <span style={styles.value}>Farm-fresh eggs with rich, flavorful yolks. Great for cooking, baking, or a hearty breakfast.</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>🔢 Quantity: </span>
          <span style={styles.value}>1 tray</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>⏳ Expiry Date: </span>
          <span style={styles.value}>2025-05-17</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>📞 Contact Details: </span>
          <span style={styles.value}>den@example.com</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>📍 Location: </span>
          <span style={styles.value}>Bukil Jalil, Kuala Lumpur</span>
        </div>
      </div>

      {/* Post 2*/}
      <div style={styles.card}>
      <div style={styles.titleRow}>
          <h3 style={styles.title}>Bread</h3>
          <div style={styles.photo}>
            <img 
              src="https://www.bakersdelight.com.au/wp-content/uploads/2018/10/1001.jpg" 
              alt="Bread" 
              style={styles.photo}
            />
          </div>
        </div>
        <div style={styles.desRow}>
          <span style={styles.label}>📝 Description: </span>
          <span style={styles.value}>Freshly baked bread. Perfect for sandwiches, toast, or enjoying on its own. Available for sell of exchange.</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>🔢 Quantity: </span>
          <span style={styles.value}>2 Loaves</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>⏳ Expiry Date: </span>
          <span style={styles.value}>2025-05-2</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>📞 Contact Details: </span>
          <span style={styles.value}>dd@example.com</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>📍 Location: </span>
          <span style={styles.value}>Cheras, Selangor</span>
        </div>
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
  desRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '1rem',
    color: '#333',
    wordBreak: 'break-word', 
    whiteSpace: 'normal',  
    overflowWrap: 'break-word',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  photo: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  searchInput: {
    padding: '8px',
    border: '1px solid #fffff',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
  },
  buttonFrame: {
    display: 'flex', 
    gap: '10px', 
    marginBottom: '20px'
  },
  button: {
    flex: 1, 
    padding: '10px', 
    backgroundColor: '#ff6f61', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px' 
  },
  filterButton: {
    padding: '10px', 
    borderRadius: '5px', 
    background: 'none', 
    border: 'none',
  },
  filButton: {
    width: '24px', 
    height: '24px',
  },
};

export default Social;

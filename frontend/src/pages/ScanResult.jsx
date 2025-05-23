import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScanResult = ({ scannedImage, groceryList, goBackHome, isLoading }) => {
  const [zoomOut, setZoomOut] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ foodName: '', quantity: '', measurement_unit: '', expiryDate: '' });
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setZoomOut(true);
        setItems(groceryList.map(item => ({ ...item, expiryDate: '' })));
      }, 300);
    }
  }, [isLoading, groceryList]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleAddNewItem = () => {
    if (newItem.foodName.trim() === '') {
      alert('Please enter a food name.');
      return;
    }
    setItems([...items, { ...newItem }]);
    setNewItem({ foodName: '', quantity: '', measurement_unit: '', expiryDate: '' });
    setAddingNew(false);
  };

  const saveAndBackHome = async () => {
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/saveData', { foodItems: items });
      alert('Items saved successfully!');
      goBackHome();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save items. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      borderRadius: '30px',
      padding: "10px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '5rem',
      paddingBottom: '2rem',
      boxSizing: 'border-box',
    }}>
      
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: zoomOut ? '80%' : '95%',
        maxWidth: zoomOut ? '300px' : '100%',
        aspectRatio: '3/4',
        padding: (!isLoading && !zoomOut) ? '0px' : '0',
        borderRadius: '30px',
        overflow: 'visible',
        transition: 'all 1s ease',
        boxShadow: isLoading 
          ? '0 0 25px rgba(252, 70, 107, 0.6), 0 0 45px rgba(173, 80, 168, 0.5)' 
          : '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: isLoading ? 'colorPulse 12s ease-in-out infinite' : 'none',
      }}>
        <img
          src={scannedImage}
          alt="Scanned"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 1s ease',
            borderRadius: '30px',
          }}
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '30px',
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25), rgba(255, 200, 200, 0.15), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Items List */}
      {!isLoading && (
        <div style={{
          marginTop: '2rem',
          width: '90%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeSlideUp 1s ease forwards',
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#333' }}>
            Detected Items
          </h2>

          {items.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
              {items.map((item, index) => (
                <li key={index} style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <input
                    type="text"
                    value={item.foodName}
                    onChange={(e) => handleItemChange(index, 'foodName', e.target.value)}
                    placeholder="Food Name"
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%' }}
                    />
                    <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                    placeholder="Category"
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%' }}
                    />
                    <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%' }}
                    />
                    <input
                    type="text"
                    value={item.measurement_unit}
                    onChange={(e) => handleItemChange(index, 'measurement_unit', e.target.value)}
                    placeholder="Measurement Unit"
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%' }}
                    />
                    <input
                    type="date"
                    value={item.expiryDate}
                    onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                    placeholder="Expiry Date"
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%' }}
                    />

                  <button
                    onClick={() => handleDeleteItem(index)}
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: '#ff6f61',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No food items detected.</p>
          )}

          {/* Add New Item */}
          <div style={{ marginTop: '2rem', width: '100%' }}>
          {!addingNew ? (
            <button
                onClick={() => setAddingNew(true)}
                style={{
                width: '100%',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
            >
                ➕ Add New Item
            </button>
            ) : (
            <>
                <h3 style={{ marginBottom: '0.5rem' }}>New Item</h3>
                <input
                type="text"
                value={newItem.foodName}
                onChange={(e) => setNewItem({ ...newItem, foodName: e.target.value })}
                placeholder="Food Name"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="Category"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                type="text"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Quantity"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                type="text"
                value={newItem.measurement_unit}
                onChange={(e) => setNewItem({ ...newItem, measurement_unit: e.target.value })}
                placeholder="Measurement Unit"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                type="date"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                    onClick={handleAddNewItem}
                    style={{
                    flex: 1,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    Confirm
                </button>

                <button
                    onClick={() => {
                    setAddingNew(false);
                    setNewItem({ foodName: '', quantity: '', measurement_unit: '', expiryDate: '', category: '' });
                    }}
                    style={{
                    flex: 1,
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    Cancel
                </button>
                </div>
            </>
            )}

          </div>

          {/* Save and Back to Home Button */}
          <button
            onClick={saveAndBackHome}
            disabled={saving}
            style={{
              marginTop: '2rem',
              width: '100%',
              backgroundColor: saving ? '#ccc' : '#ff6f61',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {saving ? 'Saving...' : 'Save and Back to Home'}
          </button>
        </div>
      )}

      {/* Glowing Animation */}
      <style>
        {`
        @keyframes colorPulse {
          0% { box-shadow: 0 0 30px 10px #ff70a6; }
          50% { box-shadow: 0 0 30px 10px #70ffc7; }
          100% { box-shadow: 0 0 30px 10px #ff70a6; }
        }
        `}
      </style>

    </div>
  );
};

export default ScanResult;

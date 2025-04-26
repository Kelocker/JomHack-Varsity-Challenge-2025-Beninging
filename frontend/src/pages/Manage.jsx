import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Home.css';

const Manage = ({ setPage }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForms, setEditForms] = useState({}); // key = id, value = form data

    const extract_data = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/extract', { data: foodItems });
            console.log("Response from backend:", response.data);
            alert(`Summary extracted successfully! Check console for details.`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to extract summary');
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial food items
    const fetchFoodItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/getIngredient');
            const normalized = response.data.map((item, index) => ({
                id: index + 1,
                foodName: item.foodName,
                quantity: item.quantity,
                measurementUnit: item.measurementUnit || '',
                expiryDate: item.expiryDate,
                category: item.category
            }));
            setFoodItems(normalized);
        } catch (error) {
            console.error('Error fetching food items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete purely on frontend state
    const deleteItem = (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        setFoodItems(prev => prev.filter(item => item.id !== id));
    };

    // Enable editing for a single item
    const startEditing = (item) => {
        setEditingId(item.id);
        setEditForms(prev => ({
            ...prev,
            [item.id]: {
                foodName: item.foodName,
                quantity: item.quantity,
                measurementUnit: item.measurementUnit,
                expiryDate: item.expiryDate,
                category: item.category
            }
        }));
    };

    // Save edits purely in frontend state
    const saveEdit = (id) => {
        const updated = editForms[id];
        setFoodItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleChange = (e, id) => {
        const { name, value } = e.target;
        setEditForms(prev => ({
            ...prev,
            [id]: { ...prev[id], [name]: value }
        }));
    };

    useEffect(() => {
        fetchFoodItems();
    }, []);

    return (
        <div>
            <div className="dashboard-panel">
                <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>
                    Manage Your Food Items
                </h2>
            </div>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <div className="summary-list">
                        {foodItems.length === 0 ? (
                            <p style={{ padding: '1rem', textAlign: 'center' }}>No items found.</p>
                        ) : (
                            foodItems.map(item => (
                                <div className="summary-item" key={item.id}>
                                    {editingId === item.id ? (
                                        <div className="summary-left" style={{ width: '100%' }}>
                                            <input
                                                type="text"
                                                name="foodName"
                                                value={editForms[item.id]?.foodName || ''}
                                                onChange={e => handleChange(e, item.id)}
                                                placeholder="Food Name"
                                                style={{ marginBottom: '0.5rem', padding: '0.3rem' }}
                                            />
                                            <input
                                                type="text"
                                                name="quantity"
                                                value={editForms[item.id]?.quantity || ''}
                                                onChange={e => handleChange(e, item.id)}
                                                placeholder="Quantity"
                                                style={{ marginBottom: '0.5rem', padding: '0.3rem' }}
                                            />
                                            <input
                                                type="text"
                                                name="measurementUnit"
                                                value={editForms[item.id]?.measurementUnit || ''}
                                                onChange={e => handleChange(e, item.id)}
                                                placeholder="Measurement Unit"
                                                style={{ marginBottom: '0.5rem', padding: '0.3rem' }}
                                            />
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={editForms[item.id]?.expiryDate || ''}
                                                onChange={e => handleChange(e, item.id)}
                                                placeholder="Expiry Date"
                                                style={{ marginBottom: '0.5rem', padding: '0.3rem' }}
                                            />
                                            <input
                                                type="text"
                                                name="category"
                                                value={editForms[item.id]?.category || ''}
                                                onChange={e => handleChange(e, item.id)}
                                                placeholder="Category"
                                                style={{ marginBottom: '0.5rem', padding: '0.3rem' }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => saveEdit(item.id)}
                                                    style={{
                                                        backgroundColor: '#4CAF50',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    style={{
                                                        backgroundColor: '#9E9E9E',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="summary-left">
                                                <div className="food-name">{item.foodName}</div>
                                                <div className="food-detail">
                                                    {item.expiryDate} @ {item.quantity} {item.measurementUnit || '-'}
                                                </div>
                                                <div className="category">{item.category}</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                <button
                                                    onClick={() => startEditing(item)}
                                                    style={{
                                                        backgroundColor: '#2196F3',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteItem(item.id)}
                                                    style={{
                                                        backgroundColor: '#f44336',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <button className="extract-btn" onClick={() => extract_data()}>
                        Save
                    </button>

                    <button className="extract-btn" onClick={() => setPage('home')}>
                        Back to Home
                    </button>
                </>
            )}
        </div>
    );
};

export default Manage;

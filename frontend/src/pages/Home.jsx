import React, { useState, useEffect } from 'react';
import { IconCalendarBolt, IconBuildingStore, IconMoneybag } from "@tabler/icons-react";
import '../css/Home.css';
import homeIcon from '../utils/icons/home.png';
import exploreIcon from '../utils/icons/explore.png';
import scanIcon from '../utils/icons/scan.png';
import impactIcon from '../utils/icons/impact.png';
import locationIcon from '../utils/icons/location.png';
import axios from 'axios';



const Home = ({ lang, setPage }) => {
  const highlights = [
    { title: "Concert This Week 🎤", desc: "Expect a spike in late-night orders." },
    { title: "Burger Sales 🚀", desc: "Your burger sales increased by 20%!" },
    { title: "Afternoon Slump 😴", desc: "3-5PM sales dropped. Maybe run a drink promo?" },
  ];

  const [msg, setMsg] = useState('');
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => setMsg(response.data.message))
      .catch(error => console.error('Error fetching hello:', error));

    axios.get('http://localhost:5000/api/getIngredient')  // <-- Your real API endpoint for food items
      .then(response => {
        console.log('Fetched food items:', response.data);
        setFoodItems(response.data);
      })
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  return (
    <div>
      {/* Dashboard Panel */}
      <div style={{ position: 'relative', marginBottom: '4rem' }}>
        <div className="dashboard-panel">
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            2 meals saved • 1 item wasted this week
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="dashboard-card">
          <div className="dashboard-buttons">
            <button className="dashboard-btn">
              <img src={homeIcon} alt="Impact" className="dashboard-icon" />
              <span>Home</span>
            </button>
            <button className="dashboard-btn" onClick={() => setPage('planner')}>
              <img src={impactIcon} alt="Home" className="dashboard-icon" />
              <span>Planner</span>
            </button>
            <button className="dashboard-btn">
              <img src={exploreIcon} alt="Explore" className="dashboard-icon" />
              <span>Explore</span>
            </button>
            <button className="dashboard-btn" onClick={() => setPage('social')}>
              <img src={locationIcon} alt="Account" className="dashboard-icon" />
              <span>Nearby</span>
            </button>
          </div>
        </div>

        {/* Recommended Card */}
        <div style={{
          marginTop: '2rem',
          background: '#fff',
          borderRadius: '10px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }} onClick={() => setPage('recipe')}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            🍽️ Recommended for Tomorrow
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src="https://www.supermomix.com/wp-content/uploads/2018/03/diary-free-carbonara-1024x1024.jpg"
              alt="Spaghetti Carbonara"
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>Spaghetti Carbonara</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Creamy pasta perfect for busy evenings.
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table Section */}
        <div style={{ marginTop: '2rem' }}>
          <h1 style={{ textAlign: 'center', fontSize: '1.2rem', color: '#ff6f61' }}>{msg}</h1>
          <div className="summary-list">
            {foodItems.map((item, index) => (
              <div className="summary-item" key={index}>
                <div className="summary-left">
                  <div className="food-name">{item.foodName}</div>
                  <div className="food-detail">{item.expiryDate} @ {item.quantity} {item.measurementUnit || '-'}</div>
                </div>
                <div className="category">{item.category}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setPage('manage')} className="extract-btn">
            Manage
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;

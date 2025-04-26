import React from 'react';
import { IconCalendarBolt, IconBuildingStore, IconMoneybag } from "@tabler/icons-react";
import '../css/Home.css'
import homeIcon from '../utils/icons/home.png';
import exploreIcon from '../utils/icons/explore.png';
import scanIcon from '../utils/icons/scan.png';
import impactIcon from '../utils/icons/impact.png';
import locationIcon from '../utils/icons/location.png';

const Home = ({ lang, setPage }) => {
  const highlights = [
    { title: "Concert This Week 🎤", desc: "Expect a spike in late-night orders." },
    { title: "Burger Sales 🚀", desc: "Your burger sales increased by 20%!" },
    { title: "Afternoon Slump 😴", desc: "3-5PM sales dropped. Maybe run a drink promo?" },
  ];

  return (
    <div>
      {/* Header */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Welcome Back 👋</h2>
      </div> */}


<div style={{ position: 'relative', marginBottom: '4rem' }}>
  <div className="dashboard-panel">
  {/* <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Welcome Back 👋</h2> */}
  <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
  2 meals saved • 1 item wasted this week
</p>



  </div>
  
  <div className="dashboard-card">
    <div className="dashboard-buttons">
      <button className="dashboard-btn">
        <img src={impactIcon} alt="Impact" className="dashboard-icon" />
        <span>Impact</span>
      </button>
      <button className="dashboard-btn">
        <img src={homeIcon} alt="Home" className="dashboard-icon" />
        <span>Home</span>
      </button>
      <button className="dashboard-btn">
        <img src={exploreIcon} alt="Explore" className="dashboard-icon" />
        <span>Explore</span>
      </button>
      <button className="dashboard-btn">
        <img src={locationIcon} alt="Account" className="dashboard-icon" />
        <span>Location</span>
      </button>
    </div>
  </div>

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
      <div style={{ fontSize: '0.9rem', color: '#666' }}>Creamy pasta perfect for busy evenings.</div>
    </div>
  </div>
</div>



{/* https://www.supermomix.com/wp-content/uploads/2018/03/diary-free-carbonara-1024x1024.jpg */}


  </div>



      {/* Highlight Cards */}
      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {highlights.map((item, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</div>
            <div style={{ color: '#555' }}>{item.desc}</div>
          </div>
        ))}
      </div> */}

      {/* Sections */}
      {/* <div style={{ marginTop: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconCalendarBolt size={20} className="text-violet-800" /> Events Nearby
        </h3>
        <p style={{ color: '#666' }}>No major events coming up. All clear!</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconBuildingStore size={20} className="text-blue-500" /> Shop Stats
        </h3>
        <p style={{ color: '#666' }}>Orders up 15% vs last week 💪</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconMoneybag size={20} className="text-yellow-500" /> Smart Tips
        </h3>
        <p style={{ color: '#666' }}>Bundle fries + drinks for RM2 more to boost revenue.</p>
      </div> */}
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Scan from './pages/Scan.jsx';
import Impact from './pages/Impact.jsx';
import Account from './pages/Account.jsx';
import langDict from './utils/lang';

import homeIcon from './utils/icons/home.png';
import exploreIcon from './utils/icons/explore.png';
import scanIcon from './utils/icons/scan.png';
import impactIcon from './utils/icons/impact.png';
import accountIcon from './utils/icons/account.png';

function App() {
  const [page, setPage] = useState('home');
  const [prevPage, setPrevPage] = useState('home'); // 🧠 track where user came from
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [cameraMode, setCameraMode] = useState(false);

  const changeLang = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  const renderPage = () => {
    const lang = langDict[language];
    switch (page) {
      case 'home': return <Home lang={lang} />;
      case 'explore': return <Explore lang={lang} />;
      case 'scan': return (
        <Scan
          lang={lang}
          setCameraMode={setCameraMode}
          cameraMode={cameraMode}
          goBack={() => setPage(prevPage)} // 🧠 pass goBack logic
        />
      );
      case 'impact': return <Impact lang={lang} />;
      case 'account': return <Account lang={lang} language={language} changeLang={changeLang} />;
      default: return <Home lang={lang} />;
    }
  };

  return (
    <div className={`phone-wrapper ${cameraMode ? 'camera-active' : ''}`}>
      {!cameraMode && (
        <header className="app-header">
          <h1>Yummi</h1>
        </header>
      )}

      {/* Page Content */}
      <div style={{ flex: 1, overflow: cameraMode ? 'hidden' : 'auto', padding: cameraMode  }}>
        {renderPage()}
      </div>

      {/* Bottom Tab Bar – hidden during camera */}
      {!cameraMode && (
        <nav className="tab-bar">
          <button onClick={() => setPage('home')}>
            <img src={homeIcon} alt="Home" className="nav-icon" />
          </button>
          <button onClick={() => setPage('explore')}>
            <img src={exploreIcon} alt="Explore" className="nav-icon" />
          </button>
          <button
            onClick={() => {
              setPrevPage(page); // 🧠 record current page before going to scan
              setPage('scan');
            }}
            className="scan-btn"
          >
            <img src={scanIcon} alt="Scan" className="nav-icon" />
          </button>
          <button onClick={() => setPage('impact')}>
            <img src={impactIcon} alt="Impact" className="nav-icon" />
          </button>
          <button onClick={() => setPage('account')}>
            <img src={accountIcon} alt="Account" className="nav-icon" />
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;

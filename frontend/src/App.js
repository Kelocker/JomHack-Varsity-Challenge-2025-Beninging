import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Scan from './pages/Scan.jsx';
import Impact from './pages/Impact.jsx';
import Account from './pages/Account.jsx';
import Recipe from './pages/Recipe.jsx';
import Social from './pages/Social.jsx';
import Planner from './pages/Planner.jsx';
import Manage from './pages/Manage.jsx';


import langDict from './utils/lang';

import homeIcon from './utils/icons/home.png';
import exploreIcon from './utils/icons/explore.png';
import scanIcon from './utils/icons/scan.png';
import impactIcon from './utils/icons/impact.png';
import accountIcon from './utils/icons/account.png';
import ScanResult from './pages/ScanResult.jsx';



function App() {
  const [page, setPage] = useState('home');
  const [prevPage, setPrevPage] = useState('home');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [cameraMode, setCameraMode] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const changeLang = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  
  const renderPage = () => {
    const lang = langDict[language];
    switch (page) {
      case 'home': return <Home lang={lang} setPage={setPage} />;
      case 'explore': return <Explore lang={lang} />;
      case 'scan': return (
        <Scan
          lang={lang}
          setCameraMode={setCameraMode}
          cameraMode={cameraMode}
          setScannedImage={setScannedImage}
          setGroceryList={setGroceryList}
          setIsLoading={setIsLoading}
          goToResult={() => setPage('scanResult')}
          goBack={() => setPage(prevPage)}
        />
      );
      case 'impact': return <Impact lang={lang} />;
      case 'account': return <Account lang={lang} language={language} changeLang={changeLang} />;
      case 'recipe': return <Recipe setPage={setPage} />;
      case 'planner': return <Planner lang={lang} setPage={setPage} />;
      case 'social': return <Social lang={lang} setPage={setPage}/>;


      case 'scanResult': return (
        <ScanResult
          scannedImage={scannedImage}
          groceryList={groceryList}
          isLoading={isLoading}
          goBackHome={() => setPage('home')}
        />
      );
      case 'manage': return <Manage setPage={setPage}/>;
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

      <div style={{ flex: 1, overflow: cameraMode ? 'hidden' : 'auto', padding: cameraMode}}>
        {renderPage()}


        
      </div>

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
              setPrevPage(page);
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

import React, { useRef, useState, useEffect } from 'react';
import scanIcon from '../utils/icons/camera.png';

const Scan = ({ setCameraMode, cameraMode, goBack, lang }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [tab, setTab] = useState('camera'); // camera | library
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.warn("Video play() interrupted:", err);
          });
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraMode(false);
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg');
      setPreview(base64Image);
      sendToBackend(base64Image);
    }
  };

  const sendToBackend = async (base64Image) => {
    try {
      const res = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      setResponse(data.result || lang.scanPage.noItems);
    } catch (err) {
      console.error('Error sending image:', err);
      setResponse(lang.scanPage.error);
    }
  };

  const handleLibrarySelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => sendToBackend(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setCameraMode(true); // <-- trigger full-screen mode
  
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  
    return () => {
      stopCamera();
      setCameraMode(false); // <-- clean up
    };
  }, [tab]);
  

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      {cameraMode && (
        <div style={styles.header}>
          <button onClick={() => {
          stopCamera();
          goBack();
        }} style={styles.backBtn}>←</button>

        <span style={styles.headerText}>{lang.scanPage.scan}</span>
        </div>
      )}

      {/* Main Section */}
      <div style={styles.body}>
        {/* Camera View */}
        {tab === 'camera' && (
          <div style={styles.cameraContainer}>
            <video ref={videoRef} style={styles.video} />
            <button onClick={takePicture} style={styles.captureBtn}><img src={scanIcon} alt="Scan" className="nav-icon-scan" /></button>
          </div>
        )}

        {/* Library View */}
        {tab === 'library' && (
          <div style={styles.libraryContainer}>
            <label htmlFor="fileInput" style={styles.uploadBtn}>📁 {lang.scanPage.uploadFromLibrary}</label>
            <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleLibrarySelect} />
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div style={styles.bottomTabs}>
      <button
        onClick={() => setTab('camera')}
        style={tab === 'camera' ? styles.activeTab : styles.inactiveTab}
      >
        {lang.scanPage.scan}
      </button>

      <button
        onClick={() => {
          document.getElementById('fileInputTrigger').click();
        }}
        style={styles.inactiveTab}
      >
        {lang.scanPage.scanFromLibrary}
      </button>


        {/* Hidden file input always present */}
        <input
          type="file"
          accept="image/*"
          id="fileInputTrigger"
          style={{ display: 'none' }}
          onChange={handleLibrarySelect}
        />
      </div>


      {/* Canvas (hidden) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9', // aligned with .phone-wrapper
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff7f0', // aligned with .app-header
    color: '#ff6f61',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // matches app
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  backBtn: {
    fontSize: '1.5rem',
    background: 'none',
    color: '#ff6f61',
    border: 'none',
    cursor: 'pointer',
    marginRight: '1rem'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000', // black during scan mode
    position: 'relative',
    overflow: 'hidden',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#000', // ensure black background
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // important!
    display: 'block',
  },   
  captureBtn: {
    position: 'absolute',
    bottom: '90px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffffffdd',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
  },
  libraryContainer: {
    width: '100%',
    height: '100%',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  uploadBtn: {
    fontSize: '1.2rem',
    backgroundColor: '#4CAF50', // matches scan button in app
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    border: 'none'
  },
  bottomTabs: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '80px',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '0 1rem'
  },
  activeTab: {
    backgroundColor: '#ff6f61',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.6rem 1.5rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer'
  },
  inactiveTab: {
    backgroundColor: '#ffffff',
    color: '#999',
    fontWeight: 'normal',
    padding: '0.6rem 1.5rem',
    borderRadius: '20px',
    border: '1px solid #ddd',
    cursor: 'pointer'
  }
  
};


export default Scan;

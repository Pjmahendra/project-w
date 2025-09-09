import React, { useState, useEffect } from 'react'

import './App.css'

import image1 from './assets/23.jpeg'
import BounceCards from './BounceCards.jsx'
import CircularGallery from './CircullerGallery.jsx'
import GradientText from './gradiant.jsx'
import DomeGallery from './DomeGallery.jsx'
import apiService from './services/api'
function App() {
  const [showText, setShowText] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [birthdayMessages, setBirthdayMessages] = useState([]);
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load birthday messages from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [messagesResponse, statusResponse] = await Promise.all([
          apiService.getBirthdayMessages(),
          apiService.getServerStatus()
        ]);
        
        setBirthdayMessages(messagesResponse.data);
        setServerStatus(statusResponse);
      } catch (error) {
        console.error('Failed to load data from backend:', error);
        // Fallback to hardcoded messages if backend is not available
        setBirthdayMessages([
          "May your special day be filled with happiness, laughter, and love! 🎉",
          "Wishing you a year ahead full of adventure, joy, and beautiful moments! ✨",
          "Here's to celebrating the amazing person you are today and always! 💖",
          "May all your birthday wishes come true and your dreams take flight! 🌟"
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleButtonClick = async () => {
    setShowText(true);
    setButtonClicked(true);
    
    // Try to get a random message from backend
    try {
      const response = await apiService.request('/api/birthday/random-message');
      if (response.success) {
        // You could display this random message somewhere
        console.log('Random birthday message:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to get random message:', error);
    }
  };

  return (
    <div className='APP' style={{padding:'20px'}}>
      <div style={{fontSize:'10rem'}}></div>
      {/* Server Status Indicator */}
      {serverStatus && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#4CAF50',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Backend Connected ✓
        </div>
      )}
      <div>
        <h1 style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:'50px',fontWeight:"bolder", padding:0}}>HAPPY BIRTHDAY🎂</h1>
        <p style={{textAlign:"center" ,padding:0}}>to my most favorite person ever🥰</p>
        <p style={{textAlign:'center',fontWeight:'300',fontSize:'2rem'}}>How lucky you are being a wonderful, amazing, and an absolutely incredible person!</p>
      </div>
      {/* <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
      </div> */}
      <div style={{ width: '100%', height: '70vh' }}>
      <DomeGallery />
    </div>
      <div style={{display:'flex',justifyContent:'center',padding:'2rem'}}>
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff'
          }}
        >
          <img 
            src={image1} 
            alt="Birthday" 
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'cover',
              objectPosition: 'top',
              borderRadius: '50%',
            }} 
          />
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'center'}}>
        <div className='message-grid' >
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading birthday messages...</div>
          ) : (
            birthdayMessages.slice(0, 4).map((message, index) => (
              <div key={index} className='message-box'>{message}</div>
            ))
          )}
        </div>
      </div>
     <div style={{display:'flex',justifyContent:'center',padding:'0'}}>
       {!buttonClicked ? (
         <button 
           style={{border:"none",backgroundColor:"transparent",fontSize:"1rem"}}
           onClick={handleButtonClick}
         >
           Click me
         </button>
       ) : (
         <div style={{textAlign:'center',fontSize:'1.2rem',fontWeight:'500',color:'#333'}}>
            Neeku evarina cheppara nee smile bauntadi ani!! 🎉
         </div>
       )}
     </div>
      <div style={{textAlign:'center',fontWeight:'300',padding:'2rem',fontSize:'01rem'}}>
        <p>Here's to another year of laughter, love, and unforgettable memories! 🎂✨</p>
        <p></p>
      </div>
    </div>
  )
}

export default App

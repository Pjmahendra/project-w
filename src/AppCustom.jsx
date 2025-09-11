import React, { useState, useEffect } from 'react'
import './App.css'
import image1 from './assets/23.jpeg'
import DomeGallery from './DomeGallery.jsx'
import customApi from './services/customApi'

function AppCustom() {
  const [showText, setShowText] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [birthdayMessages, setBirthdayMessages] = useState([]);
  const [serverStats, setServerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitorName, setVisitorName] = useState('');
  // Wishes feature removed

  // Load data from custom server on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check if server is online
        const isOnline = await customApi.isServerOnline();
        if (!isOnline) {
          throw new Error('Custom server is offline');
        }

        // Track visitor
        await customApi.trackVisitor('Birthday App User');

        // Load data in parallel
        const [messagesResponse, statsResponse] = await Promise.all([
          customApi.getBirthdayMessages(),
          customApi.getServerStats()
        ]);
        
        setBirthdayMessages(messagesResponse.data || []);
        setServerStats(statsResponse);
        // wishes feature removed
      } catch (error) {
        console.error('Failed to load data from custom server:', error);
        // Fallback to hardcoded messages
        setBirthdayMessages([
          "May your special day be filled with happiness, laughter, and love! 🎉",
          "May all your birthday wishes come true and your dreams take flight! 🌟",
          "Wishing you a year ahead full of adventure, joy, and beautiful moments! ✨"
        ]);
        // wishes feature removed
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleButtonClick = async () => {
    setShowText(true);
    setButtonClicked(true);
    try {
      const response = await customApi.getRandomBirthdayMessage();
      if (response?.success && response?.message) {
        // Prepend the new birthday message to the list
        setBirthdayMessages(prev => [response.message, ...prev]);
      } else if (response?.success && response?.data?.message) {
        setBirthdayMessages(prev => [response.data.message, ...prev]);
      }
    } catch (error) {
      console.error('Failed to get random message:', error);
    }
  };

  // Wishes feature removed

  return (
    <div className='APP' style={{padding:'20px'}}>
      <div style={{fontSize:'10rem'}}></div>
      

      <div>
        <h1 style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:'50px',fontWeight:"bolder", padding:0}}>
          HAPPY BIRTHDAY 🎂
        </h1>
        <p style={{textAlign:"center" ,padding:0}}>to my favaorite person❣️</p>
        <p style={{textAlign:'center',fontWeight:'300',fontSize:'2rem'}}>How lucky you are being a wonderful, amazing, and an absolutely incredible person!</p>
      </div>

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

      {/* Dynamic Birthday Messages */}
      <div style={{display:'flex',justifyContent:'center'}}>
        <div className='message-grid'>
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading birthday messages...</div>
          ) : (
            (birthdayMessages || []).slice(0, 4).map((message, index) => (
              <div key={index} className='message-box'>{message}</div>
            ))
          )}
        </div>
      </div>

      {/* Interactive Button */}
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
            Nuvvu naavuthu unte chaala bauntav Laasya,keep smiling!! 🎉
          </div>
        )}
      </div>

      {/* Wishes feature removed */}

      <div style={{textAlign:'center',fontWeight:'300',padding:'2rem',fontSize:'01rem'}}>
        <p>Here's to another day of laughter, love, and unforgettable memories for Laasya! 🎂✨</p>
      </div>
    </div>
  )
}

export default AppCustom

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
  const [showWishForm, setShowWishForm] = useState(false);
  const [wishForm, setWishForm] = useState({ name: '', wish: '', email: '' });
  const [wishes, setWishes] = useState([]);

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
        const [messagesResponse, statsResponse, wishesResponse] = await Promise.all([
          customApi.getBirthdayMessages(),
          customApi.getServerStats(),
          customApi.getBirthdayWishes()
        ]);
        
        setBirthdayMessages(messagesResponse.data || []);
        setServerStats(statsResponse);
        setWishes(wishesResponse.data || []);
      } catch (error) {
        console.error('Failed to load data from custom server:', error);
        // Fallback to hardcoded messages
        setBirthdayMessages([
          "May your special day be filled with happiness, laughter, and love! 🎉",
          "Wishing you a year ahead full of adventure, joy, and beautiful moments! ✨",
          "Here's to celebrating the amazing person you are today and always! 💖",
          "May all your birthday wishes come true and your dreams take flight! 🌟"
        ]);
        setWishes([]);
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
      if (response.success) {
        console.log('Random birthday message:', response.data.message);
        // You could show this in a toast or modal
      }
    } catch (error) {
      console.error('Failed to get random message:', error);
    }
  };

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await customApi.addBirthdayWish(
        wishForm.name || 'Anonymous',
        wishForm.wish,
        wishForm.email || null
      );
      
      if (response.success) {
        setWishes(prev => [...prev, response.data]);
        setWishForm({ name: '', wish: '', email: '' });
        setShowWishForm(false);
        alert('Thank you for your beautiful wish! 💖');
      }
    } catch (error) {
      console.error('Failed to submit wish:', error);
      alert('Failed to submit wish. Please try again.');
    }
  };

  return (
    <div className='APP' style={{padding:'20px'}}>
      <div style={{fontSize:'10rem'}}></div>
      

      <div>
        <h1 style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:'50px',fontWeight:"bolder", padding:0}}>
          HAPPY BIRTHDAY LAASYA🎂
        </h1>
        <p style={{textAlign:"center" ,padding:0}}>to our most favorite person ever🥰</p>
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
            Laasya, neeku evarina cheppara nee smile bauntadi ani!! 🎉
          </div>
        )}
      </div>

      {/* Birthday Wishes Section */}
      <div style={{textAlign:'center',padding:'2rem'}}>
        <h3>Leave a Birthday Wish for Laasya! 💖</h3>
        {!showWishForm ? (
          <button 
            onClick={() => setShowWishForm(true)}
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              margin: '10px'
            }}
          >
            Write a Wish
          </button>
        ) : (
          <form onSubmit={handleWishSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={wishForm.name}
              onChange={(e) => setWishForm({...wishForm, name: e.target.value})}
              style={{width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd'}}
            />
            <textarea
              placeholder="Your birthday wish for Laasya..."
              value={wishForm.wish}
              onChange={(e) => setWishForm({...wishForm, wish: e.target.value})}
              required
              style={{width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd', height: '80px'}}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={wishForm.email}
              onChange={(e) => setWishForm({...wishForm, email: e.target.value})}
              style={{width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ddd'}}
            />
            <div>
              <button type="submit" style={{
                background: '#4CAF50',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                color: 'white',
                margin: '5px'
              }}>
                Submit Wish
              </button>
              <button type="button" onClick={() => setShowWishForm(false)} style={{
                background: '#f44336',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                color: 'white',
                margin: '5px'
              }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Display Recent Wishes */}
      {(wishes || []).length > 0 && (
        <div style={{textAlign:'center',padding:'2rem'}}>
          <h3>Recent Birthday Wishes for Laasya 💝</h3>
          <div style={{maxWidth: '600px', margin: '0 auto'}}>
            {(wishes || []).slice(-3).map((wish, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <strong>{wish.name}:</strong> {wish.wish}
                <div style={{fontSize: '12px', opacity: 0.7, marginTop: '5px'}}>
                  {new Date(wish.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{textAlign:'center',fontWeight:'300',padding:'2rem',fontSize:'01rem'}}>
        <p>Here's to another year of laughter, love, and unforgettable memories for Laasya! 🎂✨</p>
        <p>Powered by your custom birthday server for Laasya! 🚀</p>
      </div>
    </div>
  )
}

export default AppCustom

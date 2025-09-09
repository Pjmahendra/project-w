import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppCustom from './AppCustom.jsx'

// You can switch between App and AppCustom by changing the import
// App = Original version with basic backend
// AppCustom = Enhanced version with your custom server
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppCustom />
  </StrictMode>,
)

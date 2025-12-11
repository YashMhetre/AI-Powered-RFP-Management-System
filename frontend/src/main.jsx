import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ApiProvider } from './context/ApiContext'
import './index.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<ApiProvider>
<App />
</ApiProvider>
</BrowserRouter>
</React.StrictMode>
)
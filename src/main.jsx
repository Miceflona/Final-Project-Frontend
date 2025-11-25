// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <--- WAJIB ADA
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- ROUTER HARUS DI LUAR AUTH PROVIDER */}
      <AuthProvider> {/* <--- PROVIDER SEKARANG MEMBUNGKUS APP */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
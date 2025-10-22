import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DocumentCreate from './pages/DocumentCreate'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentCreate />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
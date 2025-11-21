import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FastDashApp } from './FastDashApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FastDashApp />
  </StrictMode>,
)

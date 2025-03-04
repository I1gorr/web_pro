import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Heropage from './heropage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Heropage></Heropage>
   </StrictMode>,
)

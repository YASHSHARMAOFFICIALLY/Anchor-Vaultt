import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@solana/wallet-adapter-react-ui/styles.css";
import {AppwalletProvider} from './components/provider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppwalletProvider>
    </AppwalletProvider>
    <App />
  </StrictMode>,
)

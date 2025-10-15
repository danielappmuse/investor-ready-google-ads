import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prevent scroll restoration on page load to avoid jumps on mobile
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure page starts at top
window.scrollTo(0, 0);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <App />
);

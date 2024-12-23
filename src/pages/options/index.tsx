// src/pages/options/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Options } from './Options';
import '../../styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

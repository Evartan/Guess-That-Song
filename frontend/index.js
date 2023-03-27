import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';
import { BrowserRouter } from "react-router-dom";

import './stylesheets/style.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

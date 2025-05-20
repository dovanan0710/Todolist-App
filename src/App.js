import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import './assets/styles/index.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "Todo App";
  }, []);
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
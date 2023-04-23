import React, { useState, useEffect } from 'react';
import './App.css';
import HeaderTab from './components/HeaderTab';
import { Routes, Route, Link } from 'react-router-dom';
import LoginSignUp from './pages/LoginSignUp';
import LuckyDiceGame from './pages/LuckyDiceGame';

function App() {
  return (

    <div className="App">
      <HeaderTab/>
      {/* <Routes>

        <Route path='/' element={<LoginSignUp />} />
        <Route path='/game' element={<LuckyDiceGame />} />
        </Routes> */}
    </div>

  );
}

export default App;
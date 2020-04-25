import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";

import MainContainer from './components/MainContainer';
import './App.css';
import LoginScreen from './components/Authorization/LoginScreen';
import GhAuth from './components/Authorization/GhAuth';
import LiAuth from './components/Authorization/LiAuth';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={MainContainer} />
        <Route exact path="/ghAuth" component={GhAuth} />
        <Route exact path="/liAuth" component={LiAuth} />
        <Route exact path="/login" component={LoginScreen} />

      </BrowserRouter>
    </div>
  );
}

export default App;

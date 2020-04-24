import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";

import MainContainer from './components/MainContainer';
import './App.css';
import LoginScreen from './components/Authorization/LoginScreen';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/" component={MainContainer} />
      </BrowserRouter>
    </div>
  );
}

export default App;

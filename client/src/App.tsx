import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";

import * as api from './api';
import MainContainer from './components/MainContainer/MainContainer';
import './App.css';
import LoginScreen from './components/Authorization/LoginScreen';
import GhAuth from './components/Authorization/GhAuth';
import LiAuth from './components/Authorization/LiAuth';
import MainHeader from './components/MainHeader/MainHeader';
import EditArticle from './components/EditArticle/EditArticle';
import { ApiResponse } from './types/ApiResponse';
import { ResponseStatus } from './enums/ResponseStatus';
import { setTags } from './globalData';
import getTypeFromObject from './helpers/getTypeFromObject';

export default class App extends React.Component {

  async componentDidMount() {
    const response: ApiResponse = await api.getTags();
    if (response.status == ResponseStatus.SUCCESS && response.payload) {
      setTags(getTypeFromObject<Array<string>>(response.payload));
    } else {
      console.error(response);
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <MainHeader />
          <Route exact path="/" component={MainContainer} />
          <Route exact path="/posts" component={MainContainer} />
          <Route exact path="/ghAuth" component={GhAuth} />
          <Route exact path="/liAuth" component={LiAuth} />
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path="/editArticle" component={EditArticle} />

        </BrowserRouter>
      </div>
    );
  }
}

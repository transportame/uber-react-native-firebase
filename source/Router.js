import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';

import SplashPage         from './pages/SplashPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import RegisteredPage     from './pages/RegisteredPage'
import PickUpLocationPage from './pages/PickUpLocationPage'
import { login, logout, register } from '../data/fbio';

export default class TransportameRouter extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="auth" initial={true}>
            <Scene key="login" component={LoginPage} title="Login" login={login}></Scene>
            <Scene key="signUp" component={RegisterPage} title="Registro" register={register}></Scene>
            <Scene key="signUpCompleted" component={RegisteredPage} title="Registro completo!"></Scene>
          </Scene>
          <Scene key="home">
            <Scene key="pickUpLocation" component={PickUpLocationPage}></Scene>
          </Scene>
        </Scene>
      </Router>
    );
  }
}

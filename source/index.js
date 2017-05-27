import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import Router from './Router';

import SplashPage         from './pages/SplashPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import RegisteredPage     from './pages/RegisteredPage'
import PickUpLocationPage from './pages/PickUpLocationPage'

export default class UberFooBarReactNativeFirebase extends Component {
    render() {
        return (
          <Router></Router>
        );
    }
}

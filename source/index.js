import React, { Component } from 'react';

import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import morelia from '../native-base-theme/variables/morelia';
import Router from './Router';
import firebase from '../data/fbio';

export default class UberFooBarReactNativeFirebase extends Component {
    render() {
        return (
          <StyleProvider style={getTheme(morelia)}>
            <Router isLogged={firebase.auth().currentUser}></Router>
          </StyleProvider>
        );
    }
}

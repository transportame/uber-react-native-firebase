import React, { Component } from 'react';

import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import morelia from '../native-base-theme/variables/morelia';
import Router from './Router';


export default class UberFooBarReactNativeFirebase extends Component {
    render() {
        return (
          <StyleProvider style={getTheme(morelia)}>
            <Router></Router>
          </StyleProvider>
        );
    }
}

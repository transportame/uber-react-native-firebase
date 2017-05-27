import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { Button, Text } from 'native-base';

import theme from '../constants/theme';

export default class TButton extends Component {
  render() {
    return (
        <Button {...this.props}>
          <Text>
            { this.props.children }
          </Text>
        </Button>
    );
  }
}

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.primary,
    marginTop: 10,
    padding: 10
  }
});

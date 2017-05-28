import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { Container, Content, Form, Button, Text,  Item, Input, Label } from 'native-base';

import { Actions, ActionConst } from 'react-native-router-flux';

var usernamePlaceholder="Correo";
var passwordPlaceholder="Contraseña";
var passwordAgainPlaceholder="Repetir contraseña";
var submit="Registrarse";
var cancel="Cancelar";

export default class Login extends Component {
    state = {
        email:         null,
        password:      null,
        passwordAgain: null,
        loading:       false,
    }

    updateCredentials(key, value) {
      let credentials = this.state;
      credentials[key] = value;
      this.setState(credentials);
    }

    async register() {
      try {
        await this.props.register(this.state.email, this.state.password);
        Alert.alert(
          'Bienvenido',
          'Ahora puedes hacer uso del servicio',
          [
            {text: 'OK', onPress: () => Actions.home()},
          ]
        );

      } catch (error) {
        Alert.alert(
          'Error',
          error.toString(),
          [
            {text: 'OK', onPress: () => console.log('OK Pressed!')},
          ]
        );
      }
    }

    render() {
        if (!this.state.loading) {
            if (this.props.usernamePlaceholder)
                {usernamePlaceholder=this.props.usernamePlaceholder};
            if (this.props.passwordPlaceholder)
                {passwordPlaceholder=this.props.passwordPlaceholder};
            if (this.props.passwordAgainPlaceholder)
                {passwordPlaceholder=this.props.passwordAgainPlaceholder};
            if (this.props.submit)
                {submit=this.props.submit};
            if (this.props.cancel)
                {cancel=this.props.cancel};

            return (
                <View style={RegisterPageStyles.container}>
                  <Content>
                    <Form>
                      <Item floatingLabel>
                        <Label>{usernamePlaceholder}</Label>
                        <Input keyboardType={'email-address'}
                          onChangeText={(value) => { this.updateCredentials('email', value); }}/>
                      </Item>

                      <Item floatingLabel>
                        <Label>{passwordPlaceholder}</Label>
                        <Input secureTextEntry={true}
                          onChangeText={(value) => { this.updateCredentials('password', value); }}/>
                      </Item>

                      <Item floatingLabel>
                        <Label>{passwordAgainPlaceholder}</Label>
                        <Input secureTextEntry={true}
                          onChangeText={(value) => { this.updateCredentials('passwordAgain', value); }}/>
                      </Item>

                      <View style={{marginVertical:10}} />
                      <Button block primary onPress={() => this.register()}>
                        <Text>{submit}</Text>
                      </Button>

                      <Button block success transparent onPress={() => Actions.login({ type: ActionConst.BACK})}>
                          <Text  style={{color: "#5cb85c"}}>{cancel}</Text>
                      </Button>

                    </Form>
                  </Content>
              </View>
            );
        } else {
            return <ActivityIndicator size="large"/>
        }

    }
}

const RegisterPageStyles = StyleSheet.create({
  container: {
    marginTop: 150,
    marginHorizontal: 50,
    flex: 1
  },
});

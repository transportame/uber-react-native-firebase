import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Container, Content, Form, Button, Text,  Item, Input,Label } from 'native-base';


var usernamePlaceholder="Username";
var passwordPlaceholder="Password";
var submit="Login";
var register="Registro";

export default class Login extends Component {
    state = {
        email:    null,
        password: null,
        loading: false,
    }

    updateCredentials(key, value) {
      let credentials = this.state;
      credentials[key] = value;
      this.setState(credentials);
    }

    async login() {
        try {
          await this.props.login(this.state.email, this.state.password);
          Actions.home();
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
            if (this.props.submit)
                {submit=this.props.submit};
            if (this.props.register)
                {register=this.props.register};

            return (
                <View style={LoginPageStyles.container}>
                  <Content>
                    <Form>
                      <Item floatingLabel>
                        <Label>Username</Label>
                        <Input />
                      </Item>
                      <Item floatingLabel>
                        <Label>Password</Label>
                        <Input />
                      </Item>
                    </Form>

                    <Button block onPress={() => this.login()}>
                      <Text>
                        { submit }
                      </Text>
                    </Button>

                    <Button block success transparent onPress={Actions.signUp}>
                      <Text style={{color: "#5cb85c"}}>
                        { register }
                      </Text>
                    </Button>
                  </Content>
                </View>
            );
        } else {
            return <ActivityIndicator size="large"/>
        }
    }
}

const LoginPageStyles = StyleSheet.create({
    container: {
      marginTop: 150,
      marginHorizontal: 50,
      flex: 1
    }
});

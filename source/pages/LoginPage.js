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

import { Button, Text } from 'native-base';


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
                    <View style={LoginPageStyles.body}>
                    <View>
                        <Text>{this.props.title}</Text>
                        <View style={{margin:15}} />
                        <TextInput
                          onChangeText={(value) => { this.updateCredentials('email', value); }}
                          style={LoginPageStyles.textInput}
                          placeholder={usernamePlaceholder}
                        />
                        <TextInput
                          onChangeText={(value) => { this.updateCredentials('password', value); }}
                          style={LoginPageStyles.textInput}
                          secureTextEntry={true}
                          placeholder={passwordPlaceholder}
                        />
                        <View style={{margin:7}} />

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
                    </View>
                    </View>
                </View>
            );
        } else {
            return <ActivityIndicator size="large"/>
        }
    }
}

const LoginPageStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1
    },
    body: {
        flex: 9,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        margin: 5,
    },
    textInput: {
        height: 40,
        width: 250,
        borderWidth: 1
    },
    transparentButton: {
        marginTop: 5,
        padding:  15,
    },
    transparentButtonText: {
        color: '#0485A9',
        textAlign: 'center',
        fontSize: 16
    },
    primaryButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18
    },
    image: {
        width:  100,
        height: 100
    },
});

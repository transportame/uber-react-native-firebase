import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableHighlight,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';

var usernamePlaceholder="Username";
var passwordPlaceholder="Password";
var passwordAgainPlaceholder="Repeat Password";
var submit="Sign Up";
var cancel="Cancel";

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
                    <View style={RegisterPageStyles.body}>
                    <View>
                        <Text style={RegisterPageStyles.title}>{this.props.title}</Text>
                        <View style={{margin:15}} />
                        <TextInput
                          style={RegisterPageStyles.textInput}
                          placeholder={usernamePlaceholder}
                          onChangeText={(value) => { this.updateCredentials('email', value); }}
                        />
                        <TextInput
                          style={RegisterPageStyles.textInput} secureTextEntry={true}
                          placeholder={passwordPlaceholder}
                          onChangeText={(value) => { this.updateCredentials('password', value); }}
                        />
                        <TextInput
                          style={RegisterPageStyles.textInput}
                          secureTextEntry={true}
                          placeholder={passwordAgainPlaceholder}
                          onChangeText={(value) => { this.updateCredentials('passwordAgain', value); }}
                        />
                        <View style={{margin:7}} />
                        <TouchableHighlight style={RegisterPageStyles.primaryButton}
                            onPress={() => this.register()}>
                            <Text style={RegisterPageStyles.primaryButtonText}>{submit}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={RegisterPageStyles.transparentButton}
                            onPress={() => Actions.login({ type: ActionConst.BACK})}>
                            <Text style={RegisterPageStyles.transparentButtonText}>{cancel}</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
                </View>
            );
        } else {
            return <ActivityIndicator size="large"/>
        }

    }
}

const RegisterPageStyles = StyleSheet.create({
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
    primaryButton: {
        marginTop: 10,
        padding:   10,
        backgroundColor: 'black',
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

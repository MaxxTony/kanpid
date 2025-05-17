import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {GetApi, Post} from '../Helpers/Service';
import Spinner from './Spinner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toaster from './Toaster';
import OneSignal from 'react-native-onesignal';

import base64 from 'base-64';
import jwt_decode from 'jwt-decode';

const AppleLogin = props => {
  const [loading, setLoading] = useState(false);
  const loginWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('Apple login success', appleAuthRequestResponse);

      register(appleAuthRequestResponse);

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        console.log('Apple login success', credentialState);
      }
      console.log('userInfo================>', userInfo);
    } catch (error) {
      console.log(error);
      //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //     // user cancelled the login flow
      //   } else if (error.code === statusCodes.IN_PROGRESS) {
      //     // operation (e.g. sign in) is in progress already
      //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //     // play services not available or outdated
      //   } else {
      //     // some other error happened
      //   }
    }
  };

  function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  const register = response => {
    const {user, email, identityToken /* etc */} = response;

    let userEmail = email;
    try {
      if (!userEmail) {
        userEmail = jwt_decode(identityToken)?.email;
      }
    } catch (error) {
      console.log(error);
    }

    let data = {
      email: userEmail,
      social_id: user,
      type: 'apple',
    };

    OneSignal.getDeviceState().then(async d => {
      (data.device_token = d.pushToken), (data.player_id = d.userId);
      console.log('data==========>', data);
      setLoading(true);
      Post('register', data).then(
        async res => {
          setLoading(false);
          // console.log(res);
          console.log(res.data);
          if (res.status == 200) {
            await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
            props.navigation.navigate('main');
          } else {
            // Toaster(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    });
  };

  return (
    <>
      <Spinner color={'#fff'} visible={loading} />
      {/* <AppleButton /> */}
      <TouchableOpacity
        onPress={() => {
          loginWithApple();
        }}
        style={Styles.loginbtn}>
        <Image
          source={require('../assets/Images/apple_logo.png')}
          resizeMode="contain"
          style={Styles.icon}
        />
        <Text style={Styles.login}>Sign in with Apple</Text>
      </TouchableOpacity>
    </>
  );
};
const Styles = StyleSheet.create({
  login: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Mulish-Regular',
    marginLeft: 10,
  },
  loginbtn: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4AAB7E',
    borderRadius: 7,
    marginTop: 10,
    flexDirection: 'row',
  },
  icon: {
    height: 30,
    width: 30,
  },
});
export default AppleLogin;

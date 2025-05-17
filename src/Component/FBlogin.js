import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {
//   Profile,
//   Settings,
//   LoginManager,
//   GraphRequest,
//   GraphRequestManager,
//   AccessToken,
// } from 'react-native-fbsdk-next';
import OneSignal from 'react-native-onesignal';
import {
  Settings,
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk-next';
import {GetApi, Post} from '../Helpers/Service';
import Spinner from './Spinner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toaster from './Toaster';

const FBlogin = props => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Settings.initializeSDK();
  }, []);

  const login = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        console.log(result);
        // alert(`loginres => ${JSON.stringify(result)}`)
        if (result.isCancelled) {
          console.log('cancelled', result);
        } else {
          getUserData();
        }
      },
    );
  };

  const getUserData = () => {
    AccessToken.getCurrentAccessToken().then(data => {
      console.log(data);
      let token = data.accessToken.toString();
      fetch(
        'https://graph.facebook.com/v2.5/me?fields=email,name,id,picture&access_token=' +
          token,
      )
        .then(response => response.json())
        .then(json => {
          console.log(json);

          register(json);
        })
        .catch(() => {
          console.log('ERROR GETTING DATA FROM FACEBOOK');
        });
    });
  };

  const FBLogout = () => {
    AccessToken.getCurrentAccessToken().then(data => {
      let token = data.accessToken.toString();
      let logout = new GraphRequest(
        'me/permissions/',
        {
          accessToken: token,
          httpMethod: 'DELETE',
        },
        (error, result) => {
          if (error) {
            console.log('Error fetching data: ' + error.toString());
          } else {
            LoginManager.logOut();
          }
        },
      );
      new GraphRequestManager().addRequest(logout).start();
    });
  };

  const register = user => {
    const {email, name, id} = user;
    let data = {
      email,
      social_id: id,
      type: 'facebook',
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
            FBLogout();
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
      <TouchableOpacity
        onPress={() => {
          login();
        }}
        style={Styles.loginbtn}>
        <Image
          source={require('../assets/Images/fbLogin.png')}
          resizeMode="contain"
          style={Styles.icon}
        />
        <Text style={Styles.login}>Sign in with Facebook</Text>
      </TouchableOpacity>
    </>
  );
};
const Styles = StyleSheet.create({
  defaultView: {
    width: '100%',
    height: 50, 
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 10, 
  },
  login: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Mulish-Regular',
    marginLeft: 10,
  },
  loginbtn: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3375e4',
    borderRadius: 7,
    marginTop: 20,
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 5,
  },
  icon: {
    height: 30,
    width: 30,
  },
});
export default FBlogin;

import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {GetApi, Post} from '../Helpers/Service';
import Spinner from './Spinner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toaster from './Toaster';
import OneSignal from 'react-native-onesignal';
import { webClientId } from '../Config';



const config = {
  webClientId:
    webClientId,
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
};

const GoogleLogin = props => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const googleWithLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const {photo, email, name, id} = userInfo.user;
        let obj = {...userInfo.user, socialType: 'GMAIL'};
        // checkIfSocialSignup(obj, "google");
        // checkEmail(email);
        register(userInfo.user);
      }
      console.log('userInfo================>', userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  // const checkEmail = async email => {
  //   setLoading(true);
  //   // GetApi(`emailExists/${email}`, {...props}).then(
  //   const user = await AsyncStorage.getItem('userDetail');
  //   let userDetail = JSON.parse(user);
  //   axios
  //     .get(`https://kanpid.com/api/emailExists/${email}`, {
  //       headers: {
  //         Authorization: `Bearer ${userDetail?.token | ''}`,
  //       },
  //     })
  //     .then(
  //       async res => {
  //         setLoading(false);
  //         if (res.data.status == 200) {
  //           console.log(res.data.message);
  //           if (res.data.message === 'email exists') {
  //             await AsyncStorage.setItem(
  //               'userDetail',
  //               JSON.stringify(res.data.data),
  //             );
  //             props.navigation.navigate('main');
  //           } else if (res.data.data === 'email not exists') {
  //             props.navigation.navigate('EditProfile', {email, type: 'google'});
  //           }
  //           GoogleSignin.signOut();
  //         }
  //       },
  //       err => {
  //         setLoading(false);
  //         console.log(err);
  //       },
  //     );
  // };

  const register = user => {
    const {photo, email, name, id} = user;
    const data = {
      email,
      social_id: id,
      type: 'google',
    };

    OneSignal.getDeviceState().then(async d => {
      (data.device_token = d.pushToken), (data.player_id = d.userId);
      console.log('data==========>', data);
      GoogleSignin.signOut();
      setLoading(true);
      Post('register', data).then(
        async res => {
          setLoading(false);
          console.log(res);
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
      {/* <GoogleSigninButton
        style={{
          height: 48,
          // width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          googleWithLogin();
        }}
      /> */}
      <TouchableOpacity
        onPress={() => {
          googleWithLogin();
        }}
        style={Styles.loginbtn}>
        <Image
          source={require('../assets/Images/googleLogin.png')}
          resizeMode="contain"
          style={Styles.icon}
        />
        <Text style={Styles.login}>Sign in with Google</Text>
      </TouchableOpacity>
    </>
  );
};
const Styles = StyleSheet.create({
  login: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black', //#FFFFFF
    fontFamily: 'Mulish-Regular',
    marginLeft: 10,
  },
  loginbtn: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', //#4AAB7E
    borderRadius: 7,
    marginTop: 10,
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
export default GoogleLogin;

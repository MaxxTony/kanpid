import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';
import GoogleLogin from '../../Component/GoogleLogin';
import FBlogin from '../../Component/FBlogin';
import AppleLogin from '../../Component/AppleLogin';
import Logo from '../../assets/img/Logo';

const height = Dimensions.get('screen').height;
const SignIn = props => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
  });
  const [filedCheck, setfiledCheck] = useState([]);

  const navigateProfileCreation = (socialData, socialType) => {
    console.log(socialData, socialType);
    // props.navigation.navigate('createProfile', {
    //   apiData: socialData,
    //   socialType,
    //   inputValue: socialData?.email,
    // });
  };

  const submit = () => {
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        Toaster('Your email id is invalid');
        return;
      }

      const data = {
        email: userDetail.email,
        password: userDetail.password,
      };

      OneSignal.getDeviceState().then(async d => {
        setLoading(true);
        (data.device_token = d.pushToken), (data.player_id = d.userId);
        console.log('data==========>', data);
        Post('postlogin', data).then(
          async res => {
            setLoading(false);
            console.log(res);
            if (res.status == 200) {
              await AsyncStorage.setItem(
                'userDetail',
                JSON.stringify(res.data),
              );
              // Toaster(res.message);
              props.navigation.push('main');
            } else {
              Toaster(res.message);
            }
          },
          err => {
            setLoading(false);
            console.log(err);
          },
        );
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#103524'}}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={{
            height: 200,
            alignItems: 'center',
            marginTop: 50,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Logo width={200} height={45} />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            borderTopStartRadius: 50,
            borderTopEndRadius: 50,
            paddingHorizontal: 30,
            paddingVertical: 40,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: '#103524',
              fontFamily: 'Mulish-Regular',
            }}>
            Sign In
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: '#727272',
              fontFamily: 'Mulish-Regular',
              marginTop: 5,
            }}>
            Please sign in to countinue using our app.
          </Text>
          <View style={{marginTop: 40}}>
            <View>
              <TextInput
                placeholder="Email"
                style={styles.inputFild}
                placeholderTextColor="#787878"
                value={userDetail.email}
                onChangeText={text => {
                  setUserDetail({...userDetail, email: text});
                }}></TextInput>
              {filedCheck.includes('EMAIL') && (
                <Text style={{color: 'red'}}> Email id is required</Text>
              )}
            </View>

            <View style={{marginTop: 15}}>
              <TextInput
                placeholder="Password"
                style={styles.inputFild}
                placeholderTextColor="#787878"
                secureTextEntry={true}
                value={userDetail.password}
                onChangeText={text => {
                  setUserDetail({...userDetail, password: text});
                }}></TextInput>
              {filedCheck.includes('PASSWORD') && (
                <Text style={{color: 'red'}}> Password is required</Text>
              )}
            </View>

            <View style={{alignItems: 'flex-end', marginTop: 10}}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ForgotPassword')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#5A5A5A',
                    fontFamily: 'Mulish-Regular',
                  }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signbtn}
              onPress={() => {
                submit();
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'Mulish-Regular',
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
            <View style={styles.acountBtn}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#5A5A5A',
                  fontFamily: 'Mulish-Regular',
                }}>
                Dont't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('SignUp')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#4AAB7E',
                    fontFamily: 'Mulish-Regular',
                  }}>
                  {' '}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialSection}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#5A5A5A',
                  fontFamily: 'Mulish-Regular',
                  textAlign: 'center',
                }}>
                or sign in with social media
              </Text>
              <View>
                <FBlogin {...props} />
                <GoogleLogin {...props} />
                {Platform.OS === 'ios' && <AppleLogin {...props} />}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputFild: {
    backgroundColor: '#F3F3F3',
    borderRadius: 7,
    paddingHorizontal: 10,
    fontWeight: '500',
    height: 48,
    fontFamily: 'Mulish-Regular',
  },
  signbtn: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4AAB7E',
    borderRadius: 7,
    marginTop: 20,
  },
  acountBtn: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  logingl: {
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#EA4335',
    height: 35,
    // marginLeft: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialSection: {
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopColor: '#F3F3F3',
    borderTopWidth: 1,
  },
});

export default SignIn;

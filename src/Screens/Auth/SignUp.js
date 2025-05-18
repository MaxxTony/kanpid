import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import GoogleLogin from '../../Component/GoogleLogin';
import FBlogin from '../../Component/FBlogin';
import AppleLogin from '../../Component/AppleLogin';
import Logo from '../../assets/img/Logo';

const SignUp = props => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
    rePassword: '',
  });
  const [filedCheck, setfiledCheck] = useState([]);

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

      if (userDetail.password.length < 6) {
        Toaster('Your password must be at least 6 characters long');
        return;
      }

      if (userDetail.password !== userDetail.rePassword) {
        Toaster('Your password does not match with confirm password');
        return;
      }

      const data = {
        email: userDetail.email,
        password: userDetail.password,
        type: 'normal',
      };

      setLoading(true);
      Post('register', data).then(
        res => {
          setLoading(false);
          console.log(res?.data);
          if (res.status == 200) {
            Toaster(res.message);
            const data = {
              from: 'signup',
              ...res.data,
            };
            props.navigation.navigate('OtpVerify', {data});
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#103524'}}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity
          style={styles.backArow}
          onPress={() => props.navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <View
          style={{
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Logo width={200} height={45} />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
            paddingHorizontal: 30,
            paddingVertical: 40,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: '#103524',
              fontFamily: 'Mulish-Regular',
              fontFamily: 'Mulish-Regular',
            }}>
            Sign Up
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: '#727272',
              fontFamily: 'Mulish-Regular',
              marginTop: 5,
            }}>
            Please registration with email and sign up to continue using our
            app.
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

            <View style={{marginTop: 15}}>
              <TextInput
                placeholder="Re-enter Password"
                style={styles.inputFild}
                placeholderTextColor="#787878"
                secureTextEntry={true}
                value={userDetail.rePassword}
                onChangeText={text => {
                  setUserDetail({...userDetail, rePassword: text});
                }}></TextInput>
              {filedCheck.includes('REPASSWORD') && (
                <Text style={{color: 'red'}}>
                  {' '}
                  Confirm password is required
                </Text>
              )}
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
                Sign Up
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
                Already have an account!
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Signin')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#4AAB7E',
                    fontFamily: 'Mulish-Regular',
                  }}>
                  {' '}
                  Sign In
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
                or create account using social media
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
  backArow: {
    backgroundColor: '#9AC96D',
    height: 35,
    width: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
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

export default SignUp;

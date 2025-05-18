import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgotPassword = props => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
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

      const data = {
        email: userDetail.email,
      };
      console.log('data==========>', data);
      setLoading(true);
      Post('send_otp', data).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status == 200) {
            props.navigation.navigate('OtpVerify', {data: res.data});
            Toaster(res.message);
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

        <View style={{height: 200, alignItems: 'center'}}>
          <Image source={require('../../assets/Images/logo.png')} />
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
            Forgot Password?
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: '#727272',
              fontFamily: 'Mulish-Regular',
              marginTop: 5,
            }}>
            Enter your registered email below to receive password reset
            instruction
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

            <TouchableOpacity style={styles.signbtn} onPress={() => submit()}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'Mulish-Regular',
                }}>
                Send
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
                Remember password?
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
});

export default ForgotPassword;

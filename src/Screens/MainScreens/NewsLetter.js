import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {checkForEmptyKeys, checkEmail} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';

const NewsLetter = props => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
  });
  const [filedCheck, setfiledCheck] = useState([]);

  const submit = () => {
    let {anyEmptyInputs} = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length === 0) {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        Toaster('Your email id is invalid');
        return;
      }

      const data = {
        email: userDetail.email,
      };

      Post('postSubscribe', data).then(
        async res => {
          setLoading(false);
        
          if (res.status == 200) {
            props.navigation.push('main');
            Toaster(`Subscribe SucessFully on ${userDetail.email}`);
            setUserDetail({
              email: '',
            });
          } else {
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
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,

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
            NewsLetter
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#9AC96D',
              fontFamily: 'Mulish-Regular',
              marginTop: 5,
            }}>
            {'Get latest news & update'}
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

            <TouchableOpacity
              style={styles.signbtn}
              //   onPress={() => props.navigation.push('main')}
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
                SUBSCRIBE
              </Text>
            </TouchableOpacity>
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
});

export default NewsLetter;

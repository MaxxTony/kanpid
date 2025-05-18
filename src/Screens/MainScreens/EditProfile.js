import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
  checkSpecialCharacter,
  checkString,
} from '../../Helpers/InputsNullChecker';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Post, GetApi} from '../../Helpers/Service';
// import * as ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import ActionSheet from 'react-native-actions-sheet';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Geocode from 'react-geocode';
import { GOOGLE_API_KEY } from '../../Config';

const selectionCamera = createRef();

const EditProfile = props => {
  const email = props?.route?.params?.email;
  const type = props?.route?.params?.type;
  console.log(email);
  const [profileObj, setProfileObj] = useState({
    name: '',
    phone: '',
    email: '',
    // password: '123456789',
    address: '',
  });
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [filedCheck, setfiledCheck] = useState([]);
  const [imageFile, setImageFile] = useState({
    // name: 'image ',
    // filename: '',
    // type: '',
    // data: '',
  });
  const [image, setimage] = useState();

  useEffect(() => {
    if (email !== undefined) {
      checkRegistration(email);
    } else {
      getuserDetail();
    }
    if (type !== undefined) {
      setUserDetail({...userDetail, type});
    }
  }, []);

  const getuserDetail = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log(JSON.parse(user));
    if (JSON.parse(user).user_id !== undefined) {
      getProfile(JSON.parse(user).user_id, false);
    }
  };

  const checkRegistration = email => {
    setLoading(true);
    Post('check_register_otp', {email}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status == 200) {
          setUserDetail(res.data);
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));

          if (res.data !== null) {
            setProfileObj({
              name: res?.data?.first_name !== null ? res.data.first_name : '',
              phone: res?.data?.phone !== null ? res.data.phone : '',
              email: res?.data?.email !== null ? res.data.email : '',
              address: res?.data?.address !== null ? res.data.address : '',
              type: res?.data?.type !== null ? res.data.type : '',
            });
            setLocation({
              lat: res?.data?.latitude !== null ? res.data.latitude : '',
              lng: res?.data?.longitude !== null ? res.data.longitude : '',
            });
            setimage(
              res?.data?.image !== null
                ? `${Constants.imageUrl}images/${res.data.image}`
                : '',
            );
          } else {
            setProfileObj({...profileObj, email});
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getProfile = (id, type) => {
    setLoading(true);
    GetApi(`getProfileById?id=${id}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status == 200) {
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          setUserDetail(res.data);
          if (res.data !== null) {
            setProfileObj({
              name: res?.data?.first_name !== null ? res.data.first_name : '',
              phone: res?.data?.phone !== null ? res.data.phone : '',
              email: res?.data?.email !== null ? res.data.email : '',
              address: res?.data?.address !== null ? res.data.address : '',
              type: res?.data?.type !== null ? res.data.type : '',
            });
          }

          setLocation({
            lat: res?.data?.latitude !== null ? res.data.latitude : '',
            lng: res?.data?.longitude !== null ? res.data.longitude : '',
          });

          setimage(
            res?.data?.image !== null
              ? `${Constants.imageUrl}images/${res.data.image}`
              : '',
          );
        }
        if (email !== undefined && type) {
          props.navigation.navigate('main');
        } else if (email === undefined && type) {
          props.navigation.goBack();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log(PermissionsAndroid.RESULTS.GRANTED, granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
        // alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const GOOGLE_PACES_API_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  const GooglePlacesInput = async text => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${text}`;
    try {
      const check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (check) {
        setShowList(true);
        const result = await axios.request({
          method: 'post',
          url: apiUrl,
        });
        if (result) {
          const {
            data: {predictions},
          } = result;
          setPredictions(predictions);
          setShowList(true);
        }
      } else {
        getLocation();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkLocation = async add => {
    try {
      Geocode.setApiKey(GOOGLE_API_KEY);
      if (add) {
        Geocode.fromAddress(add).then(
          response => {
            console.log(response.results[0].geometry.location);
            const lat = response.results[0].geometry.location;
            setLocation(lat);
          },
          error => {
            console.error(error);
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submit = () => {
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(profileObj);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(profileObj.email);
      if (!emailcheck) {
        Toaster('Your email id is invalid');
        return;
      }
      if (checkString(profileObj.name)) {
        Toaster('Special character and Number not allowed in name field');
        return;
      }
      console.log(profileObj.phone.length);
      if (profileObj.phone.length < 12) {
        Toaster('Invalid Mobile number');
        return;
      }
      console.log('location================>', location);
      if (
        location.lat === '' ||
        location.lat === undefined ||
        location.lng === '' ||
        location.lng === undefined
      ) {
        Toaster('Please select location from list');
        return;
      }

      try {
        const d = [
          imageFile,
          {
            name: 'first_name',
            data: profileObj.name,
          },
          {
            name: 'email',
            data: profileObj.email,
          },
          {
            name: 'phone',
            data: profileObj.phone.toString(),
          },
          {
            name: 'id',
            data: userDetail.user_id.toString(),
          },
          {
            name: 'address',
            data: profileObj.address,
          },
          {
            name: 'latitude',
            data: location.lat.toString(),
          },
          {
            name: 'longitude',
            data: location.lng.toString(),
          },
          {
            name: 'type',
            data: profileObj.type,
          },
        ];
        console.log('data=>', d);
        setLoading(true);
        RNFetchBlob.fetch(
          'POST',
          `${Constants.baseUrl}update_user`,
          {
            'Content-Type': 'multipart/form-data',
          },
          d,
        )
          .then(resp => {
            console.log('res============>', resp.data);
            setLoading(false);
            if (JSON.parse(resp.data).status == 200) {
              Toaster(JSON.parse(resp.data).message);
              // setProfileObj({
              //   name: '',
              //   phone: '',
              //   address: '',
              //   email: '',
              // });
              // // setIm({});
              // setImageFile({});
              getProfile(userDetail.user_id, true);
            }
          })
          .catch(err => {
            setLoading(false);
            // console.log(err);
          });
      } catch (err) {
        // console.log(err);
      }
    }
  };
  const launchCamera = () => {
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        mediaType: 'photo',
        cropping: true,
      }).then(image => {
        const data = {
          name: 'image',
          filename: image.path.toString(),
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
        };
        setimage(image.path);
        console.log(data);
        setImageFile(data);
      });
    }, 500);
  };

  const launchImageLibrary = () => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      }).then(image => {
        console.log(image);
        const data = {
          name: 'image',
          filename: image.path.toString(),
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
        };
        setimage(image.path);
        console.log(data);
        setImageFile(data);
      });
    }, 500);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.backArow}
              onPress={() => props.navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <View style={{position: 'relative'}}>
            <Avatar.Image
              size={120}
              source={
                image !== ''
                  ? {uri: image}
                  : require('../../assets/Images/images.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={() => {
                selectionCamera.current?.show();
              }}
              style={{position: 'absolute', bottom: 0, right: 0}}>
              <Avatar.Icon
                size={40}
                icon="camera-outline"
                style={styles.camera}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profileObj.name}</Text>
        </View>

        <View style={{paddingHorizontal: 20, marginTop: 40, paddingBottom: 20}}>
          <Card style={styles.card}>
            <View>
              <View style={styles.fiedView}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.detailField}
                  textAlign="right"
                  value={profileObj.name}
                  maxLength={50}
                  onChangeText={text =>
                    setProfileObj({...profileObj, name: text})
                  }
                />
              </View>
              {filedCheck.includes('NAME') && (
                <Text style={{color: 'red'}}> Name id is required</Text>
              )}
            </View>
            <View style={{marginTop: 0}}>
              <View style={styles.fiedView}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.detailField}
                  textAlign="right"
                  editable={false}
                  value={profileObj.email}
                  onChangeText={text =>
                    setProfileObj({...profileObj, email: text})
                  }
                />
              </View>
              {filedCheck.includes('EMAIL') && (
                <Text style={{color: 'red'}}> Email id is required</Text>
              )}
            </View>

            <View style={{marginTop: 0}}>
              <View style={styles.fiedView}>
                <Text style={styles.label}>Mobile</Text>
                <TextInput
                  style={styles.detailField}
                  textAlign="right"
                  keyboardType="numeric"
                  value={profileObj.phone}
                  onChangeText={text =>
                    setProfileObj({...profileObj, phone: text})
                  }
                  maxLength={12}
                />
              </View>
              {filedCheck.includes('PHONE') && (
                <Text style={{color: 'red'}}> Mobile number is required</Text>
              )}
            </View>

            {/* <View style={{marginTop: 10}}>
              <View style={styles.fiedView}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.detailField}
                  textAlign="right"
                  secureTextEntry={true}
                  value={profileObj.password}
                  onChangeText={text =>
                    setProfileObj({...profileObj, password: text})
                  }
                />
              </View>
              {filedCheck.includes('PASSWORD') && (
                <Text style={{color: 'red'}}> Password is required</Text>
              )}
            </View> */}

            <View style={{marginTop: 0}}>
              <View style={[styles.fiedView, {borderBottomColor: '#fff'}]}>
                <Text style={styles.label}>My Address</Text>
                <TextInput
                  style={styles.detailField}
                  textAlign="right"
                  multiline={true}
                  value={profileObj.address}
                  onChangeText={text => {
                    GooglePlacesInput(text);
                    setProfileObj({...profileObj, address: text});
                  }}
                />
              </View>
            </View>
            {prediction != '' && showList && (
              <View style={prediction && styles.list}>
                {prediction.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgrey',
                    }}>
                    <Ionicons
                      name="location"
                      size={18}
                      color="#1D1D1D"
                      style={{marginHorizontal: 5}}
                    />
                    <Text
                      style={styles.item}
                      onPress={() => {
                        console.log(item);
                        setAddress(item.description);
                        checkLocation(item.description);
                        setShowList(false);
                        // setchooseCityScreen(true)
                        setProfileObj({
                          ...profileObj,
                          address: item.description,
                        });
                      }}>
                      {item.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {filedCheck.includes('ADDRESS') && (
              <Text style={{color: 'red'}}> Address is required</Text>
            )}
          </Card>

          <TouchableOpacity style={styles.signbtn} onPress={() => submit()}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
                fontFamily: 'Mulish-Regular',
              }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ActionSheet
        ref={selectionCamera}
        containerStyle={{backgroundColor: '#F5F5F5'}}>
        {/* <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', width: 50, height: 5, borderRadius: 25, marginTop: 10, textAlign: 'center' }}></View>
                </View> */}

        <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 20,
              }}>
              Choose your photo
            </Text>
          </View>
          <TouchableOpacity
            style={{flexDirection: 'row', width: '100%'}}
            onPress={() => {
              launchCamera();
              selectionCamera.current?.hide();
            }}>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 18,
                  fontWeight: '500',
                  opacity: 0.7,
                }}>
                Take a Picture
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row', marginTop: 10}}
            onPress={() => {
              launchImageLibrary();
              selectionCamera.current?.hide();
            }}>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 18,
                  fontWeight: '500',
                  opacity: 0.7,
                }}>
                Choose from gallery
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'flex-end',
            }}
            onPress={() => {
              selectionCamera.current?.hide();
            }}>
            <View style={{marginLeft: 10, width: '100%'}}>
              <Text
                style={{
                  color: '#850631',
                  fontSize: 18,
                  fontWeight: '500',
                  textAlign: 'right',
                  marginRight: 20,
                }}>
                CANCEL
              </Text>
            </View>
          </TouchableOpacity>

          {/* </RadioButton.Group> */}
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
    // marginHorizontal: 20,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    // padding: 10,
  },
  item: {
    // padding: 10,
    fontSize: 16,
    height: 'auto',
    marginVertical: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
    fontFamily: 'Mulish-SemiBold',
    width: Dimensions.get('window').width - 100,
    flexWrap: 'wrap',
    // color: '#fff',
  },
  camera: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 5,
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

  card: {
    // borderColor: 'lightgrey',
    // borderWidth: 0.5,
    borderRadius: 7,
    padding: 15,
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 5,
  },

  label: {
    color: '#8B8B8B',
    fontFamily: 'Mulish-SemiBold',
    // fontWeight: '500',
    fontSize: 16,
    // flex: 1,
  },
  detailField: {
    color: '#000',
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
    flex: 2,
    // width: '95%',
    flexWrap: 'wrap',
  },

  fiedView: {
    flexDirection: 'row',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lostText: {
    fontFamily: 'Mulish-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#fff',
  },

  lostcount: {
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 18,
    color: '#fff',
    marginTop: 10,
  },

  lostfoundItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },

  name: {
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
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
  editbtm: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 25,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  edittext: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
  avtarView: {
    height: 130,
    width: 130,
    borderColor: '#fff',
    borderWidth: 5,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
});

export default EditProfile;

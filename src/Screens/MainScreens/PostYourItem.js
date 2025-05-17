import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
  RefreshControl,
} from 'react-native';
import React, {useState, createRef, useEffect, useRef} from 'react';
import {Button, Divider, Menu, RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Copyrights from '../../Component/Copyrights';
import DatePicker from 'react-native-date-picker';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import ActionSheet from 'react-native-actions-sheet';
import RNFetchBlob from 'rn-fetch-blob';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import {checkForEmptyKeys} from '../../Helpers/InputsNullChecker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Geocode from 'react-geocode';
import axios from 'axios';
import { GOOGLE_API_KEY } from '../../Config';

const width = Dimensions.get('window').width;
const selectionCamera = createRef();

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const PostYourItem = props => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState();
  const [category, setCategory] = React.useState([]);
  const [itemObj, setItemObj] = React.useState({
    itemName: '',
    brandName: '',
    color: '',
    date: '',
    time: '',
    description: '',
    location: '',
    category: '',
  });
  const [filedCheck, setfiledCheck] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [interested, setInterested] = useState([]);
  const [datepeack, setDate] = useState(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [image, setimage] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [showList, setShowList] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const pickerValue = useRef('Select');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setValue(props?.route?.params?.type);
    getCategory();
    getuserDetail();

    props.navigation.setOptions({
      title:
        props?.route?.params?.item_id === undefined
          ? 'Post Your Item'
          : 'Update Your Item',
    });
  }, [props?.route?.params?.type]);

  useEffect(() => {
    if (props?.route?.params?.item_id) {
      getItemDetail(props?.route?.params?.item_id);
    }
  }, [props?.route?.params?.item_id]);

  const getItemDetail = id => {
    setLoading(true);
    GetApi(`editItem/${id}`).then(
      res => {
        setLoading(false);
        console.log('itemdetail', res.data);
        if (res.status == 200) {
          setItemObj({
            itemName: res?.data?.item_name,
            brandName: res?.data?.brand_name,
            color: res?.data?.colour,
            date: res?.data?.date,
            time: res?.data?.time,
            description: res?.data?.description,
            location: res?.data?.location,
            category: parseInt(res?.data?.category),
          });
          setLocation({
            lat: res?.data?.latitude,
            lng: res?.data?.longitude,
          });
          setDate(
            moment(
              `${res?.data?.date} ${res?.data?.time}`,
              'yyyy-MM-DD HH:mm',
            ).toDate(),
          );
          let img = [];
          res?.data?.all_images.forEach((ele, i) => {
            img.push(ele.imageurl);

            if (res?.data?.all_images.length === i + 1) {
              setImageFile(img);
            }
          });
          setValue(parseInt(res?.data?.item));
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
            console.log('response====================>', response);
            const lat = response.results[0].geometry.location;
            setLocation(lat);
            console.log(lat);
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

  const getuserDetail = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log(JSON.parse(user));
    setUserDetail(JSON.parse(user));
  };

  const getCategory = () => {
    setLoading(true);
    GetApi('all_category').then(
      res => {
        setLoading(false);
        // console.log(res);
        if (res.status == 200) {
          // Toaster(res.message);
          setCategory(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const option = {
    compressImageQuality: 0.8,
    includeBase64: true,
    compressImageMaxWidth: 300,
    compressImageMaxHeight: 400,
  };

  const launchCamera = () => {
    if (imageFile.length === 10) {
      Toaster('Upload up to 1o photos only');
      return;
    }
    setTimeout(() => {
      ImagePicker.openCamera(option).then(
        image => {
          imageFile.push(`data:${image.mime};base64,${image.data}`);
          setImageFile(imageFile);
          onRefresh();
        },
        err => {
          console.log(err);
        },
      );
    }, 500);
  };

  const launchImageLibrary = () => {
    if (imageFile.length === 10) {
      Toaster('Upload up to 1o photos only');
      return;
    }

    setTimeout(() => {
      ImagePicker.openPicker(option).then(
        image => {
          imageFile.push(`data:${image.mime};base64,${image.data}`);
          setImageFile(imageFile);
          onRefresh();
        },
        err => {
          console.log(err);
        },
      );
    }, 500);
  };

  const dateselect = date => {
    const formateDate = moment(date).format('YYYY-MM-DD');
    setItemObj({...itemObj, date: formateDate});
  };

  const timeselect = date => {
    const formatetime = moment(date).format('HH:mm');
    setItemObj({...itemObj, time: formatetime});
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const submit = () => {
    let {anyEmptyInputs} = checkForEmptyKeys(itemObj);
    setfiledCheck(anyEmptyInputs);

    if (
      anyEmptyInputs.includes('ITEMNAME') ||
      anyEmptyInputs.includes('CATEGORY') ||
      anyEmptyInputs.includes('DATE') ||
      anyEmptyInputs.includes('BRANDNAME') ||
      anyEmptyInputs.includes('COLOR') ||
      anyEmptyInputs.includes('TIME') ||
      anyEmptyInputs.includes('LOCATION') ||
      anyEmptyInputs.includes('DESCRIPTION')
    ) {
      return;
    }

    if (imageFile == undefined || imageFile == null) {
      Toaster('Please select the image');
      return;
    }

    let data = {
      item: value,
      item_name: itemObj.itemName,
      category: itemObj.category.toString(),
      brand_name: itemObj.brandName,
      colour: itemObj.color,
      date: itemObj.date,
      time: itemObj.time,
      location: itemObj.location,
      description: itemObj.description,
      latitude: location.lat,
      longitude: location.lng,
      user_id: userDetail.user_id,
      // new_image: imageFile,
    };

    let imgs = [];
    imageFile.forEach((ele, i) => {
      if (!ele.includes('https://')) {
        imgs.push(ele);
      }
      if (imageFile.length === i + 1) {
        // setImageFile(img);
        data.new_image = imgs;
      }
    });

    if (props?.route?.params?.item_id !== undefined) {
      data.id = props?.route?.params?.item_id.toString();
    }
    console.log(data);
    setLoading(true);
    Post(
      `${
        props?.route?.params?.item_id !== undefined
          ? 'updateItem'
          : 'insertItem'
      }`,
      data,
    ).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        if (res.status == 200) {
          console.log(res.data);
          if (props?.route?.params?.item_id !== undefined) {
            props.navigation.navigate('SerarchResult', {
              type: `search_request?user_id=${userDetail.user_id}`,
            });
          } else {
            props.navigation.navigate('main');
            Toaster(
              'Your product has sucessfully upload please wait for approval by admin',
            );
          }

          setItemObj({
            itemName: '',
            brandName: '',
            color: '',
            date: '',
            time: '',
            description: '',
            location: '',
            category: '',
          });
          setValue();
          setImageFile([]);
          setLocation({});
          setUserDetail({});
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const buttonList = [
    {
      id: '1',
      text: 'LOST ITEM',
    },
    {
      id: '2',
      text: 'FOUND ITEM',
    },
  ];

  const radioGroup = () => {
    return (
      <View
        style={{
          padding: 20,
          borderBottomColor: '#E2E2E2',
          borderBottomWidth: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {buttonList.map((item, index) => {
          return (
            <TouchableOpacity
              style={{
                padding: 5,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#5A5A5A',
                paddingHorizontal: 20,
              }}
              onPress={() => setValue(item.id.toString())}>
              <Ionicons
                name={
                  value !== item.id ? 'radio-button-off' : 'radio-button-on'
                }
                size={20}
                color={value !== item.id ? '#5A5A5A' : '#4AAB7E'}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Mulish-Bold',
                  color: '#5A5A5A',
                  marginLeft: 10,
                }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* <RadioButton.Group
          onValueChange={newValue => setValue(newValue)}
          value={value}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.radiobtn,
                  value === 'Lost Item' && styles.rdobg,
                ]}>
                <RadioButton.Item
                  label="Lost Item"
                  value={1}
                  position="leading"
                  color="#4AAB7E"
                  uncheckedColor="#C9C9C9"
                  labelStyle={styles.labeStyle}
                  style={{height: 45}}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.radiobtn,
                  value === 'Found Item' && styles.rdobg,
                ]}>
                <RadioButton.Item
                  label="Found Item"
                  value={2}
                  position="leading"
                  color="#4AAB7E"
                  uncheckedColor="#C9C9C9"
                  labelStyle={styles.labeStyle}
                  style={{height: 45}}
                />
              </View>
            </View>
          </View>
        </RadioButton.Group> */}
      </View>
    );
  };

  const selectCategory = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.label}>Select Item category</Text>
        <View
          style={[
            styles.input,
            {
              justifyContent: 'center',
              // flexDirection: 'row', //to make ios picker center
            },
          ]}>
          {Platform.OS === 'android' ? (
            <Picker
              mode="dropdown"
              style={{height: 45}}
              itemStyle={{height: 45}}
              selectedValue={itemObj.category}
              onValueChange={(itemValue, itemIndex) => {
                setItemObj({...itemObj, category: itemValue});
              }}>
              <Picker.Item label="Select" value="" />
              {category.map(item => (
                <Picker.Item label={item.name} value={item.id} key={item.id} />
              ))}
            </Picker>
          ) : (
            <Menu
              visible={showMenu}
              onDismiss={() => setShowMenu(false)}
              anchor={
                <Button
                  color="black"
                  uppercase={false}
                  labelStyle={{fontSize: 18}}
                  onPress={() => setShowMenu(true)}>
                  {pickerValue.current}
                </Button>
              }>
              {category.map(item => (
                <Menu.Item
                  onPress={() => {
                    setItemObj({...itemObj, category: item.id});
                    pickerValue.current = item.name;
                    setShowMenu(false);
                  }}
                  title={item.name}
                  key={item.id}
                />
              ))}
            </Menu>
          )}
        </View>

        {filedCheck.includes('CATEGORY') && (
          <Text style={{color: 'red'}}> Item category is required</Text>
        )}
      </View>
    );
  };

  const photoSection = () => {
    return (
      <View style={{padding: 20}}>
        <Text style={styles.photoTxt}>UPLOAD UP TO 10 PHOTOS</Text>
        <View>
          <Text style={styles.label}>Upload image</Text>
          <Pressable
            onPress={() => {
              selectionCamera.current?.show();
            }}
            style={[
              styles.input,
              {
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'flex-start',
              },
            ]}>
            <Text>Choose file</Text>
          </Pressable>

          <View
            style={styles.mainImage}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {imageFile.map((item, index) => (
              <TouchableOpacity key={index} style={[{marginRight: 5}]}>
                <View style={[styles.imageView]}>
                  <Image
                    source={{uri: item}}
                    style={[styles.imageListView]}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* )} */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Spinner color={'#fff'} visible={loading} />
      <View style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps="always">
          {radioGroup()}
          {selectCategory()}
          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Item Name</Text>
            <View style={[styles.input, {paddingHorizontal: 10}]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                value={itemObj.itemName}
                onChangeText={value => {
                  setItemObj({...itemObj, itemName: value});
                }}
              />
            </View>
            {filedCheck.includes('ITEMNAME') && (
              <Text style={{color: 'red'}}> Item name is required</Text>
            )}
          </View>

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Brand Name</Text>
            <View style={[styles.input, {paddingHorizontal: 10}]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                value={itemObj.brandName}
                onChangeText={value => {
                  setItemObj({...itemObj, brandName: value});
                }}
              />
            </View>
            {filedCheck.includes('BRANDNAME') && (
              <Text style={{color: 'red'}}> Brand name is required</Text>
            )}
          </View>

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Colour</Text>
            <View style={[styles.input, {paddingHorizontal: 10}]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                value={itemObj.color}
                onChangeText={value => {
                  setItemObj({...itemObj, color: value});
                }}
              />
            </View>
            {filedCheck.includes('COLOR') && (
              <Text style={{color: 'red'}}> Colour is required</Text>
            )}
          </View>

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Date</Text>
            <View
              style={[
                styles.input,
                {paddingHorizontal: 10, position: 'relative'},
              ]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                placeholder="dd/mm/yyyy"
                placeholderTextColor={'#A3A3A3'}
                value={itemObj.date}
                editable={false}
                // onChangeText={value => {
                //   setItemObj({...itemObj, date: value});
                // }}
              />
              <TouchableOpacity
                onPress={() => {
                  setOpen(true);
                }}
                style={{position: 'absolute', right: 20, top: 15, zIndex: 100}}>
                <Ionicons name="calendar-outline" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
            {filedCheck.includes('DATE') && (
              <Text style={{color: 'red'}}> Date is required</Text>
            )}
          </View>

          <DatePicker
            modal
            open={open}
            date={datepeack}
            mode="date"
            androidVariant={'nativeAndroid'}
            confirmText="Done"
            maximumDate={new Date()}
            onConfirm={date => {
              console.log(date);
              setOpen(false);
              setDate(date);
              dateselect(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <DatePicker
            modal
            open={openTime}
            date={datepeack}
            mode="time"
            androidVariant={'nativeAndroid'}
            confirmText="Done"
            // minimumDate={new Date()}
            onConfirm={date => {
              console.log(date);
              setOpenTime(false);
              setDate(date);
              timeselect(date);
            }}
            onCancel={() => {
              setOpenTime(false);
            }}
          />

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Time</Text>
            <View
              style={[
                styles.input,
                {paddingHorizontal: 10, position: 'relative'},
              ]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                placeholder="--:-- --"
                placeholderTextColor={'#A3A3A3'}
                value={itemObj.time}
                editable={false}
                // onChangeText={value => {
                //   setItemObj({...itemObj, time: value});
                // }}
              />
              <TouchableOpacity
                onPress={() => {
                  setOpenTime(true);
                }}
                style={{position: 'absolute', right: 20, top: 15, zIndex: 100}}>
                <Ionicons name="time-outline" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
            {filedCheck.includes('TIME') && (
              <Text style={{color: 'red'}}> Time is required</Text>
            )}
          </View>

          <View style={{paddingHorizontal: 20}}>
            <Text style={styles.label}>Location</Text>
            <View
              style={[
                styles.input,
                {paddingHorizontal: 10, position: 'relative'},
              ]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                placeholderTextColor={'#A3A3A3'}
                value={itemObj.location}
                onChangeText={value => {
                  GooglePlacesInput(value);
                  setItemObj({...itemObj, location: value});
                }}
              />
              <View
                style={{position: 'absolute', right: 20, top: 15, zIndex: 100}}>
                <Ionicons name="locate-outline" size={20} color="#000000" />
              </View>
            </View>
            {filedCheck.includes('LOCATION') && (
              <Text style={{color: 'red'}}> Location is required</Text>
            )}
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
                      setItemObj({...itemObj, location: item.description});
                    }}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              borderBottomColor: '#E2E2E2',
              borderBottomWidth: 2,
            }}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.input2, {paddingHorizontal: 10}]}>
              <TextInput
                style={{fontFamily: 'Mulish-Bold'}}
                textAlignVertical="top"
                numberOfLines={5}
                value={itemObj.description}
                onChangeText={value => {
                  setItemObj({...itemObj, description: value});
                }}
              />
            </View>
            {filedCheck.includes('DESCRIPTION') && (
              <Text style={{color: 'red'}}> Description is required</Text>
            )}
          </View>

          {photoSection()}
          <TouchableOpacity
            style={styles.signbtn}
            onPress={() => {
              submit();
              // props.navigation.navigate('SerarchResult');
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
                fontFamily: 'Mulish-Regular',
              }}>
              {props?.route?.params?.item_id === undefined
                ? 'Post Now'
                : 'Update Now'}
            </Text>
          </TouchableOpacity>
          <View style={{marginTop: 40}}>
            <Copyrights />
          </View>
        </ScrollView>
      </View>
      <ActionSheet
        ref={selectionCamera}
        containerStyle={{backgroundColor: '#F5F5F5'}}>
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
            style={{
              flexDirection: 'row',
              width: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
            onPress={() => {
              launchCamera();
              selectionCamera.current?.hide();
            }}>
            <View
              style={{
                marginLeft: 10,
              }}>
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
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
            onPress={() => {
              launchImageLibrary();
              selectionCamera.current?.hide();
            }}>
            <View
              style={{
                marginLeft: 10,
              }}>
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
    marginHorizontal: 20,
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
    width: Dimensions.get('window').width - 60,
    flexWrap: 'wrap',
    // color: '#fff',
  },
  signbtn: {
    // w/idth: ,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 7,
    margin: 20,
  },

  mainImage: {
    flexDirection: 'row',
    // paddingHorizontal: 20,
    paddingVertical: 5,
    width: width,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageListView: {
    width: 55,
    height: 55,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  imageShadow: {
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // height: 40,
    elevation: 12,
    shadowRadius: 10,
    elevation: 3,
  },
  imageView: {
    height: 58,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  phoupload: {
    fontSize: 14,
    fontFamily: 'Mulish-Bold',
    color: '#A3A3A3',
  },
  photoTxt: {
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
    color: '#5A5A5A',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Mulish-Bold',
    color: '#5A5A5A',
    marginTop: 10,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    height: 50,
  },
  input2: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
  },
  radiobtn: {
    flexDirection: 'row',
    borderColor: '#EDEDED',
    borderWidth: 2,
    borderRadius: 8,
    width: '90%',
  },

  rdobg: {
    backgroundColor: '#EDEDED',
    borderColor: '#EDEDED',
    borderRadius: 8,
    borderWidth: 2,
  },

  labeStyle: {
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
    color: '#103524',
  },
});

export default PostYourItem;

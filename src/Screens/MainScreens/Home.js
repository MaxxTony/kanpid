import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import Geocode from 'react-geocode';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import SharePost from '../../Component/SharePost';
import CoustomDropdown from '../../Component/CoustomDropdown';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { GOOGLE_API_KEY } from '../../Config';

const actionSheetRef = createRef();
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = props => {
  const dList = [
    // {name: 'Select', type: ''},
    {name: 'Lost Items', type: '1'},
    {name: 'Found Items', type: '2'},
  ];
  const images = [
    require('../../assets/Images/process1.png'),
    require('../../assets/Images/process2.png'),
    require('../../assets/Images/process3.png'),
    require('../../assets/Images/process4.png'),
  ];
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [findObj, setFindObj] = useState({
    title: 'Select',
    type: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [lostItem, setLostItem] = useState([]);
  const [foundItem, setFoundItem] = useState([]);
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [howItWork, setHowItWork] = useState(images);
  const [filedCheck, setfiledCheck] = useState([]);

  useEffect(() => {
    console.log('props', props);
    // props.navigation.setOptions({
    //   headerLeft: () => (
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //       }}>
    //       <TouchableOpacity
    //         style={[styles.backArow, {marginLeft: 0, marginBottom: 0}]}
    //         onPress={() => {
    //           props.navigation.goBack();
    //         }}>
    //         <FontAwesome5 name="arrow-left" size={18} color="#fff" />
    //       </TouchableOpacity>
    //     </View>
    //   ),
    // });

    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getHomeDetail();
      getLocation();
      setFindObj({...findObj, title: 'Select'});
    });
    return () => {
      willFocusSubscription;
    };
  }, []);

  const getDropValue = (title, type) => {
    setFindObj({...findObj, title, type});
    setShowrop(false);
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
      let check = true;
   

      

      if (check) {
        setShowList(true);
        const result = await axios.request({
          method: 'post',
          url: apiUrl,
        });
        console.log(result?.data, 'result');
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
            console.log(response.results[0].geometry.location, 'vishal');
            const lat = response.results[0].geometry.location;
            setLocation(lat);
          },
          error => {
            console.error(error, ';[;[;[');
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHomeDetail = () => {
    setLoading(true);
    GetApi('getHomePageDetail').then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          setCategory(res.data.categories);
          setLostItem(res.data.lostItems);
          setFoundItem(res.data.foundItems);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const searchResult = () => {
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(findObj);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      console.log(location);
      if (location?.lat == undefined && location?.lng == undefined) {
        Toaster('Please select location from list');
      } else {
        props.navigation.navigate('SerarchResult', {
          type: `search_request?latitude=${location.lat}&longitude=${location.lng}&item_type=${findObj.type}`,
        });
        setFindObj({
          type: '',
          location: '',
        });
        setLocation({});
      }
    }
  };

  const postItem = async type => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log(user);
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      props.navigation.navigate('PostYourItem', {type});
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getHomeDetail();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Image
          source={require('../../assets/Images/homeHeader.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View
          style={{paddingHorizontal: 20, marginTop: -40, paddingBottom: 20}}>
          <Card style={styles.card}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#103524',
                fontFamily: 'Mulish-SemiBold',
                textAlign: 'center',
              }}>
              Search what did you lost or found
            </Text>
            {Platform.OS === 'ios' && (
              <View>
                <Pressable
                  style={[styles.fiedView, {marginTop: 20}]}
                  onPress={() => setShowrop(true)}>
                  <Ionicons name="search-outline" size={25} color="#4AAB7E" />
                  <View
                    style={[
                      styles.input,
                      {justifyContent: 'center', width: '90%', flex: 1},
                    ]}>
                    <Text
                      style={[
                        {marginLeft: 20, fontSize: 16},
                        findObj.title !== 'Select' && {
                          color: 'black',
                          fontWeight: '500',
                        },
                      ]}>
                      {findObj.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{flex: 1, alignItems: 'flex-end'}}
                    onPress={() => setShowrop(true)}>
                    <Ionicons
                      name="chevron-down-outline"
                      color={Constants.red}
                      size={20}
                    />
                  </TouchableOpacity>
                </Pressable>
                <CoustomDropdown
                  visible={showDrop}
                  getDropValue={getDropValue}
                  data={dropList}
                />
              </View>
            )}

            {Platform.OS === 'android' && (
              <View style={[styles.fiedView, {marginTop: 20}]}>
                <Ionicons name="search-outline" size={25} color="#4AAB7E" />
                <View
                  style={[
                    styles.input,
                    {justifyContent: 'center', width: '90%', flex: 1},
                  ]}>
                  <Picker
                    style={{height: 45}}
                    itemStyle={{
                      height: 30,
                      borderRadius: 20,
                      borderBottomColor: '#4AAB7E',
                      borderBottomWidth: 1,
                    }}
                    selectedValue={findObj.type}
                    onValueChange={(itemValue, itemIndex) =>
                      setFindObj({...findObj, type: itemValue})
                    }>
                    <Picker.Item label="Select" value="" />
                    <Picker.Item
                      label="Lost Items"
                      value="1"
                      style={{
                        borderBottomColor: '#4AAB7E',
                        borderBottomWidth: 1,
                      }}
                    />
                    <Picker.Item label="Found Items" value="2" />
                  </Picker>
                </View>
              </View>
            )}
            {filedCheck.includes('TYPE') && (
              <Text style={{color: 'red'}}>Item type is required.</Text>
            )}
            <View style={{marginTop: 10}}>
              <View style={styles.fiedView}>
                <Ionicons name="location-outline" size={25} color="#4AAB7E" />
                <TextInput
                  style={[styles.detailField, {width: '90%'}]}
                  placeholder="Location...."
                  value={findObj.location}
                  onChangeText={text => {
                    GooglePlacesInput(text);
                    setFindObj({...findObj, location: text});
                  }}
                />
              </View>
            </View>
            {filedCheck.includes('LOCATION') && (
              <Text style={{color: 'red'}}>Location is required.</Text>
            )}

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
                        setAddress(item.description);
                        checkLocation(item.description);
                        setShowList(false);
                        setFindObj({...findObj, location: item.description});
                      }}>
                      {item.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.signbtn}
              onPress={() => {
                searchResult();
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'Mulish-Regular',
                }}>
                Find
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => {
                postItem(1);
              }}>
              <FontAwesome5
                name="cloud-download-alt"
                size={20}
                color="#DC1010"
              />
              <Text style={styles.uploadTxt}>Upload Lost Item</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              style={styles.uploadBtn2}
              onPress={() => {
                postItem(2);
              }}>
              <FontAwesome5
                name="cloud-download-alt"
                size={20}
                color="#17A86B"
              />
              <Text style={[styles.uploadTxt, {color: '#17A86B'}]}>
                Upload Found Item
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 310,
            position: 'relative',
            width: Dimensions.get('window').width,
          }}>
          <View style={{backgroundColor: '#F0F0F0', height: 270}}>
            <View style={{padding: 20, flexDirection: 'row'}}>
              <View style={{flex: 2}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#103524',
                    fontFamily: 'Mulish-SemiBold',
                  }}>
                  Browse Items By Category
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{paddingLeft: 20, position: 'absolute', top: 70}}>
              {category.map((item, index) => (
                <TouchableOpacity
                  style={category.length === index + 1 && {paddingRight: 20}}
                  key={item.id}
                  onPress={() => {
                    props.navigation.navigate('SerarchResult', {
                      type: `search_request?cat_id=${item.id}`,
                    });
                  }}>
                  <Card style={[styles.browseCard]}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        padding: 20,
                        flex: 7,
                      }}>
                      <Image
                        // source={require('../../assets/Images/electric.png')}
                        source={{
                          uri:
                            Constants.imageUrl + 'category-image/' + item.image,
                        }}
                        style={{height: 100, width: 100}}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '500',
                          color: '#103524',
                          fontFamily: 'Mulish-Medium',
                          marginTop: 15,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#F0F0F0',
                        borderBottomRightRadius: 7,
                        borderBottomLeftRadius: 7,
                        flexDirection: 'row',
                        paddingVertical: 12,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate('SerarchResult', {
                            type: `search_request?cat_id=${item.id}&item_type=2`,
                          });
                        }}
                        style={{
                          flex: 1,
                          borderRightWidth: 1,
                          borderRightColor: '#DCDCDC',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: '#4AAB7E',
                            fontFamily: 'Mulish-SemiBold',
                          }}>
                          {item.found_item_count} Listed
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate('SerarchResult', {
                            type: `search_request?cat_id=${item.id}&item_type=1`,
                          });
                        }}
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: '#FF0000',
                            fontFamily: 'Mulish-SemiBold',
                          }}>
                          {item.lost_item_count} Listed
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View>
          <View style={{padding: 20, flexDirection: 'row'}}>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#103524',
                  fontFamily: 'Mulish-SemiBold',
                }}>
                Recently added
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FF0000',
                  fontFamily: 'Mulish-SemiBold',
                }}>
                {' '}
                Lost
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#103524',
                  fontFamily: 'Mulish-SemiBold',
                }}>
                {' '}
                items
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SerarchResult', {
                  type: `search_request?item_type=1`,
                });
              }}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: '#103524',
                  fontFamily: 'Mulish-Medium',
                  textDecorationLine: 'underline',
                }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingLeft: 20}}>
            {lostItem.map((item, index) => (
              <TouchableOpacity
                style={lostItem.length === index + 1 && {paddingRight: 20}}
                key={item.id}
                onPress={() => {
                  props.navigation.navigate('ProductView', {
                    itemId: item.item_slug,
                  });
                }}>
                <Card style={[styles.lostCard]}>
                  <View style={{width: '100%'}}>
                    <Image
                      // source={require('../../assets/Images/mobile.png')}
                      source={{
                        uri: Constants.imageUrl + 'images/' + item.image,
                      }}
                      resizeMode="stretch"
                      style={{
                        width: '100%',
                        height: 170,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      SharePost({
                        post_id: item.item_slug,
                        description: item.description,
                        title: item.item_name,
                        image: Constants.imageUrl + 'images/' + item.image,
                      }).then(res => {
                        console.log(res);
                      });
                    }}>
                    <Ionicons
                      name="arrow-redo-outline"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <View style={{flex: 1, paddingHorizontal: 10}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: '#103524',
                        fontFamily: 'Mulish-SemiBold',
                        marginVertical: 5,
                      }}>
                      {item.item_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: '#656565',
                        fontFamily: 'Mulish-SemiBold',
                        marginVertical: 5,
                      }}>
                      {item.brand_name} | {item.colour} |
                      {moment(item.time, 'HH:mm').format('h:mm A')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: '#656565',
                        fontFamily: 'Mulish-SemiBold',
                      }}>
                      {item.location}
                      {/* 2336 Jack Warren Rd, Delta Junction, Alaska 99737, USA */}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <LinearGradient
          colors={['#E6F1DA', '#fff', '#fff']}
          style={{paddingVertical: 20, borderRadius: 20}}>
          <View style={{marginLeft: 0}}>
            {/* <View> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#103524',
                fontFamily: 'Mulish-Bold',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              How is it Working
            </Text>
            {/* </View> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {howItWork.map((item, index) => (
                <View
                  key={index}
                  style={{
                    paddingRight: howItWork.length === index + 1 ? 20 : 0,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={item}
                    resizeMode="contain"
                    style={{height: 320, width: 230}}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        <View style={{paddingBottom: 10}}>
          <View style={{padding: 20, flexDirection: 'row'}}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#9AC96A',
                  fontFamily: 'Mulish-SemiBold',
                }}>
                Recently Found items
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SerarchResult', {
                  type: `search_request?item_type=2`,
                });
              }}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: '#103524',
                  fontFamily: 'Mulish-Medium',
                  textDecorationLine: 'underline',
                }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingLeft: 20}}>
            {foundItem.map((item, index) => (
              <TouchableOpacity
                style={foundItem.length === index + 1 && {paddingRight: 20}}
                key={item.id}
                onPress={() => {
                  props.navigation.navigate('ProductView', {
                    itemId: item.item_slug,
                  });
                }}>
                <Card style={[styles.foundCard]}>
                  <View style={{width: '100%'}}>
                    <Image
                      // source={require('../../assets/Images/bicycle.png')}
                      source={{
                        uri: Constants.imageUrl + 'images/' + item.image,
                      }}
                      resizeMode="contain"
                      style={{width: '100%', height: 180, borderRadius: 20}}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      SharePost({
                        post_id: item.item_slug,
                        description: item.description,
                        title: item.item_name,
                        image: Constants.imageUrl + 'images/' + item.image,
                      }).then(res => {
                        console.log(res);
                      });
                    }}>
                    <Ionicons
                      name="arrow-redo-outline"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </Card>
                <View style={{flex: 1, paddingHorizontal: 10}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#000000',
                      fontFamily: 'Mulish-SemiBold',
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    {item.item_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: '#656565',
                      fontFamily: 'Mulish-SemiBold',
                      textAlign: 'center',
                    }}>
                    {item.first_name} {item.last_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ActionSheet
          ref={actionSheetRef}
          containerStyle={{backgroundColor: '#fff'}}>
          <View style={styles.actionMainView}>
            <View
              style={{
                backgroundColor: '#4AAB7E',
                width: 50,
                height: 5,
                borderRadius: 25,
                marginBottom: 30,
              }}></View>

            <Text style={{color: '#4AAB7E', fontSize: 16}}>
              Please login to item post
            </Text>
            <TouchableOpacity
              style={{marginTop: 30}}
              onPress={() => {
                props.navigation.navigate('Signin');
                actionSheetRef.current?.hide();
              }}>
              <Text style={styles.actionBtn}>Login</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: '#4AAB7E',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionMainView: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
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
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Mulish-SemiBold',
    // marginTop: 3,
  },
  title: {
    flexDirection: 'row',
    borderTopColor: '#DCDCDC',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  backIcon: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  foundCard: {
    width: 180,
    borderRadius: 25,
    padding: 0,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 2,
    // borderWidth: 1,
    // borderColor: 'black',
    // marginBottom: 20,
    marginRight: 15,
  },

  lostCard: {
    width: 220,
    minHeight: 300,
    borderRadius: 7,
    padding: 0,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 2,
    // borderWidth: 1,
    // borderColor: 'black',
    marginBottom: 20,
    marginRight: 10,
  },

  browseCard: {
    width: 220,
    height: 220,
    borderRadius: 7,
    padding: 0,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 5,
    // borderWidth: 1,
    // borderColor: 'black',
    marginBottom: 20,
    marginRight: 10,
  },

  uploadTxt: {
    textAlign: 'center',
    color: '#DC1010',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Mulish-Regular',
    marginLeft: 5,
  },

  uploadBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: '95%',
    backgroundColor: '#E9CFCF',
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 40,
  },
  uploadBtn2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: '95%',
    backgroundColor: '#CFE9D9',
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 40,
  },
  input: {
    // backgroundColor: '#F3F3F3',
    // borderRadius: 5,
    height: 50,
  },
  inputView3: {
    // borderRadius: 8,
    backgroundColor: '#F0F0F0',
    padding: 0,
    width: '95%',
    margin: 0,
    fontSize: 16,

    minHeight: 50,
  },
  inputView: {
    // borderRadius: 8,
    backgroundColor: '#fff',
    padding: 0,
    width: '100%',
    margin: 0,
    fontSize: 16,
    color: '#000',
    // paddingHorizontal: 10,
    minHeight: 50,
    textAlign: 'center',
  },
  signbtn: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4AAB7E',
    borderRadius: 7,
    marginTop: 10,
  },

  card: {
    borderRadius: 7,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 5,
  },

  detailField: {
    color: '#000',
    fontFamily: 'Mulish-SemiBold',
    // fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
    // flex: 2,
  },

  fiedView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 45,
  },

  headerImage: {
    width: '100%',
  },

  iconView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AAB7E',
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
export default Home;

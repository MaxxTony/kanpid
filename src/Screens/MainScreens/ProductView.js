import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import React, {useEffect, useState, createRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Copyrights from '../../Component/Copyrights';
import {Post, GetApi} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import moment from 'moment';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {createOpenLink} from 'react-native-open-maps';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharePost from '../../Component/SharePost';

const actionSheetRef = createRef();
const actionSheetRef2 = createRef();

const width = Dimensions.get('window').width;
const ProductView = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState(props?.route?.params?.itemId);
  const images = [
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/viewphone.png'),
  ];

  const [imageList, setImageList] = useState(images);
  const [currentindex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemObj, setItemObj] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [showPhone, setShowPhone] = useState(false);
  useEffect(() => {
    // setImageList(images);
    // setItemId(props?.route?.params?.itemId);
    if (itemId != undefined) {
      getItemDetail();
    }
    getDetail();
    return () => setUserDetail({});
  }, [itemId]);

  const getDetail = async () => {
    const u = await AsyncStorage.getItem('userDetail');

    if (!!u) {
      // console.log(JSON.parse(u));
      setUserDetail(JSON.parse(u));
    }
  };

  const getItemDetail = () => {
    setLoading(true);
    GetApi(`getItemDetail/${itemId}`).then(
      async res => {
        setLoading(false);
        let alertshow = false;
        alertshow = await AsyncStorage.getItem('alertshow');
        if (res.status == 200) {
          setItemObj(res.data.item_detail);
          if (!alertshow) {
            setModalVisible(true);
            await AsyncStorage.setItem('alertshow', 'true');
          }
          props.navigation.setOptions({title: res.data.item_detail.item_name});
          setImageList(res.data.image_data);
        }
      },
      err => {
        setLoading(false);
        console.log('u got an error', err);
      },
    );
  };

  const getProfile = id => {
    setLoading(true);
    GetApi(`getProfileById?id=${id}`).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          setUserDetail(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const chatClick = (chatId, myId) => {
    setLoading(true);
    const data = {
      current_user_id: myId,
      receiver_id: chatId,
    };
    Post(`chatClick`, data).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          props.navigation.navigate('Chat', {
            chatUser_id: itemObj.user_id,
            user_img: itemObj.user_profile_image,
            user_name: itemObj.first_name,
          });
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const selectImage = index => {
    setCurrentIndex(index);
  };

  const preNext = type => {
    if (type === 'pre') {
      if (currentindex !== 0) {
        setCurrentIndex(currentindex - 1);
      } else {
        setCurrentIndex(imageList.length - 1);
      }
    } else {
      if (currentindex !== imageList.length - 1) {
        setCurrentIndex(currentindex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const getuserDetail = async id => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      chatClick(id, JSON.parse(user).user_id);
    }
  };

  const getDetails = async id => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      actionSheetRef2.current?.setModalVisible();
    } else {
      setShowPhone(!showPhone);
    }
  };

  const card = (item, title) => {
    return (
      <View style={[styles.cardView2]}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              // props.navigation.navigate('ProductView');
            }}>
            <Image
              source={item}
              resizeMode="contain"
              style={{width: 71, height: 83, borderRadius: 5}}
            />
          </TouchableOpacity>
          <View style={{flex: 3, marginLeft: 10}}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc}>
              Member since {moment(itemObj?.member_since).format('MMM yyyy')}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View>
                <Ionicons name="location-outline" size={25} color="#4AAB7E" />
              </View>
              <View style={{marginLeft: 5, width: '90%'}}>
                <Text style={styles.cardfeture}>{itemObj?.location}</Text>
              </View>
            </View>
          </View>
        </View>
        {userDetail.user_id !== itemObj.user_id && (
          <View>
            <TouchableOpacity
              style={styles.chatbtn}
              onPress={() => {
                // getuserDetail(userDetail?.user_id, itemObj.user_id);
                getuserDetail(itemObj.user_id);
              }}>
              <Text style={styles.btntxt}>CHAT WITH “{title}”</Text>
            </TouchableOpacity>
          </View>
        )}
        {itemObj?.phone_number !== null && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              disabled={!showPhone ? true : false}
              onPress={() => Linking.openURL(`tel:${itemObj?.phone_number}`)}>
              <FontAwesome5 name="phone-alt" size={20} color="#4AAB7E" />
            </TouchableOpacity>

            {!showPhone && <Text style={styles.shownumber}> ********** </Text>}
            {showPhone && (
              <Text style={styles.shownumber}>
                {' '}
                {`${itemObj?.phone_number}`}{' '}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                // if (!userDetail) {
                //   actionSheetRef.current?.setModalVisible();
                // } else {
                //   setShowPhone(!showPhone);
                // }

                getDetails(itemObj.user_id);
              }}>
              <Text style={styles.shownumber}>
                {showPhone ? 'Hide number' : 'Show number'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const locationin = () => {
    const onRegionChange = region => {
      console.log(region);
    };

    const yosemite = {
      query: `${itemObj.latitude},${itemObj.longitude}`,
      provider: PROVIDER_GOOGLE,
      zoom: 10,
    };

    const openYosemite = createOpenLink(yosemite);

    return (
      <View style={{marginTop: 10}}>
        <Text style={styles.title}>Location in</Text>

        {itemObj.latitude != undefined && (
          <View style={{height: 200, width: width - 40, position: 'relative'}}>
            <MapView
              region={{
                latitude: parseFloat(itemObj?.latitude.toString()),
                longitude: parseFloat(itemObj?.longitude.toString()),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              style={{height: 200, width: width - 40}}>
              <Marker
                coordinate={{
                  latitude: parseFloat(itemObj.latitude.toString()),
                  longitude: parseFloat(itemObj.longitude.toString()),
                }}
              />
            </MapView>
            <TouchableOpacity
              onPress={async () => openYosemite()}
              style={[
                styles.chatbtn,
                {
                  position: 'absolute',
                  borderRadius: 18,
                  paddingHorizontal: 15,
                  right: 15,
                  bottom: 15,
                  height: 36,
                },
              ]}>
              <Text style={[styles.btntxt, {fontSize: 12}]}>VIEW MAP</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.locationText}>{itemObj?.location}</Text>
      </View>
    );
  };

  const modalOpen = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                height: 30,
                width: 30,
                zIndex: 100,
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: '#ABABAB'}}>
                X
              </Text>
            </TouchableOpacity>
            <View style={{width: width - 80}}>
              <Image source={require('../../assets/Images/safe.png')} />
              <Text style={styles.modalText}>Tips for a safe chat</Text>
              <View
                style={[
                  styles.modalTextview,
                  {
                    marginTop: 10,
                  },
                ]}>
                <FontAwesome5
                  name="check"
                  color={'#1EC055'}
                  size={12}
                  style={{marginTop: 1}}
                />
                <Text style={styles.modalText2}>
                  Do not enter UPI PIN and any other details
                </Text>
              </View>
              <View style={[styles.modalTextview]}>
                <FontAwesome5
                  name="check"
                  color={'#1EC055'}
                  size={12}
                  style={{marginTop: 1}}
                />
                <Text style={styles.modalText2}>
                  Never give money any person in “Kanpid”
                </Text>
              </View>

              <View style={[styles.modalTextview]}>
                <FontAwesome5
                  name="check"
                  color={'#1EC055'}
                  size={12}
                  style={{marginTop: 1}}
                />
                <Text style={styles.modalText2}>
                  Report suspicious users to “Kanpid”
                </Text>
              </View>

              <View style={[styles.modalTextview]}>
                <FontAwesome5
                  name="check"
                  color={'#1EC055'}
                  size={12}
                  style={{marginTop: 1}}
                />
                <Text style={styles.modalText2}>
                  Be safe, while meeting with users
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', paddingVertical: 20}}>
      <Spinner color={'#fff'} visible={loading} />
      <View style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              width,
              height: 180,
              position: 'relative',
              paddingHorizontal: 20,
            }}>
            <ImageBackground
              //source={imageList[0]}
              source={{
                uri:
                  imageList.length > 0
                    ? Constants.imageUrl +
                      'images/' +
                      imageList[currentindex].image
                    : Constants.imageUrl + 'images/' + itemObj.image,
              }}
              style={{width: width - 40, height: 180}}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover">
              {imageList.length > 0 && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 30,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      preNext('pre');
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="chevron-back" color={'white'} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      preNext('next');
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name="chevron-forward"
                      color={'white'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
            {itemObj.date != undefined && (
              <View style={styles.titledate}>
                <Text style={styles.datetxt}>{itemObj.date}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.iconView, {marginLeft: 5, marginTop: 10}]}
              onPress={() => {
                SharePost({
                  post_id: itemObj.item_slug,
                  description: itemObj.description,
                  title: itemObj.item_name,
                  screen: 'ProductView',
                  image: Constants.imageUrl + 'images/' + itemObj.image,
                }).then(res => {
                  console.log('responces aaya', res);
                });
              }}>
              <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainImage}>
            {imageList.length > 0 &&
              imageList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[{marginRight: 5}]}
                  onPress={() => {
                    selectImage(index);
                  }}>
                  <View
                    style={[
                      styles.imageView,
                      // styles.imageShadow, //temparary added
                      index === currentindex && styles.imageShadow,
                    ]}>
                    <Image
                      source={{
                        uri: Constants.imageUrl + 'images/' + item.image,
                      }}
                      style={[styles.imageListView]}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              ))}
          </View>

          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <Text style={styles.title}>Details</Text>
            <View style={styles.detailcard}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.featureName}>
                  <Text style={styles.cardtext}>Brand</Text>
                </View>
                <View style={styles.featureValue}>
                  <Text style={styles.cardtext}>{itemObj?.brand_name}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.featureName}>
                  <Text style={styles.cardtext}>Colour</Text>
                </View>
                <View style={styles.featureValue}>
                  <Text style={styles.cardtext}>{itemObj?.colour}</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={styles.featureName}>
                  <Text style={styles.cardtext}>Date</Text>
                </View>
                <View style={styles.featureValue}>
                  <Text style={styles.cardtext}>{itemObj?.date}</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={styles.featureName}>
                  <Text style={styles.cardtext}>Time</Text>
                </View>
                <View style={styles.featureValue}>
                  <Text style={styles.cardtext}>
                    {
                      itemObj.time != undefined && itemObj.time
                      // moment(itemObj.time | 'h:mm').format('h:mm A')
                    }
                  </Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderBottomColor: '#F0F0F0',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderBottomColor: '#E1E1E1',
                    borderBottomWidth: 2,
                    borderRightColor: '#E1E1E1',
                    // borderRightWidth: 2,
                    height: 30,
                  }}>
                  <Text style={styles.cardtext}>Location</Text>
                </View>
                <View
                  style={{
                    borderBottomColor: '#F0F0F0',
                    paddingLeft: 10,
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderColor: '#E1E1E1',
                    borderBottomWidth: 2,
                    borderLeftWidth: 2,
                  }}>
                  <Text style={styles.cardtext}>{itemObj?.location}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={{paddingVertical: 10}}>
              <Text style={styles.title}>Description</Text>
              <Text style={styles.des}>{itemObj?.description}</Text>
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            {card(
              itemObj?.user_profile_image != null
                ? {uri: itemObj.user_profile_image}
                : require('../../assets/Images/images.png'),
              itemObj?.first_name,
            )}
          </View>
          <View style={{paddingHorizontal: 20}}>{locationin()}</View>
          <View style={{marginTop: 40}}>
            <Copyrights />
          </View>
        </ScrollView>
      </View>
      {modalOpen()}
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
            Please login to chat
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
      <ActionSheet
        ref={actionSheetRef2}
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
            Please login to View Number
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
  modalTextview: {
    paddingVertical: 10,
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 55,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width - 40,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: '#000000',
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    marginTop: 20,
  },
  modalText2: {
    color: '#000000',
    fontFamily: 'Mulish-SemiBold',
    fontSize: 12,
    marginLeft: 5,
  },
  datetxt: {
    color: '#fff',
    fontFamily: 'Mulish-Bold',
    fontSize: 12,
  },
  titledate: {
    position: 'absolute',
    backgroundColor: '#4AAB7E',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 10,
    top: 20,
    left: 30,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Mulish-Bold',
    color: '#696969',
    marginTop: 5,
  },
  shownumber: {
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
    color: '#000000',
  },

  btntxt: {
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  chatbtn: {
    backgroundColor: '#FF0000',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cardView2: {
    // flexDirection: 'row',
    // backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    // marginTop: 10,
    // width: '100%',
  },
  cardfeture: {
    flex: 1,
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Mulish-SemiBold',
    // width: '50%',

    // marginTop: 5,
  },
  cardDesc: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Mulish-SemiBold',
    // marginTop: 5,
  },
  cardTitle: {
    color: '#103524',
    fontSize: 16,
    fontFamily: 'Mulish-SemiBold',
  },
  des: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 12,
    color: '#666666',
    lineHeight: 20,
  },
  title: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#000000',
  },
  detailcard: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E1E1E1',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  cardtext: {
    color: '#000000',
    fontFamily: 'Mulish-SemiBold',
    fontSize: 14,
  },
  featureName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 2,
    borderRightColor: '#E1E1E1',
    borderRightWidth: 2,
    height: 30,
  },
  featureValue: {
    paddingLeft: 10,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 2,
    // height: 40,
  },
  detail: {
    color: '#000000',
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
  },
  cardView: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    marginTop: 10,
  },
  mainImage: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  imageListView: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  imageShadow: {
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
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },

  iconView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AAB7E',
    position: 'absolute',
    right: 30,
    top: 10,
  },
});

export default ProductView;

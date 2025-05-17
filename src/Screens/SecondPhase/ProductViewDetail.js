import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import Spinner from '../../Component/Spinner';
import {Post, GetApi} from '../../Helpers/Service';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actions-sheet';
import moment from 'moment';
const actionSheetRef = createRef();
const actionSheetRefReport = createRef();
import Toaster from '../../Component/Toaster';

import AntDesign from 'react-native-vector-icons/AntDesign';
import SharePost from '../../Component/SharePost';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import RenderHTML from 'react-native-render-html';

const ProductViewDetail = props => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState();
  const [itemObj, setItemObj] = useState({});

  const [loading, setLoading] = useState(false);
  const width = Dimensions.get('window').width;
  const [currentindex, setCurrentIndex] = useState(0);
  const [value, setValue] = useState(null);
  const [user_id, setUserID] = useState();
  const [product_id, setProductId] = useState();
  const [qty, setQty] = useState();
  const [report, setReport] = useState('');
  const images = [
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/viewphone.png'),
  ];
  const data = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'},
    {label: '8', value: '8'},
    {label: '9', value: '9'},
    {label: '10', value: '10'},
  ];
  const [imageList, setImageList] = useState(images);
  useEffect(() => {
    setItemId(props?.route?.params?.itemId);
    if (itemId != undefined) {
      getItemDetail();
    }
  }, [itemId]);

  const getItemDetail = () => {
    console.log(itemId, 'y h id');
    setLoading(true);
    GetApi(`kanpid-product-detail/${itemId}`).then(
      async res => {
        setLoading(false);
        let alertshow = false;
        alertshow = await AsyncStorage.getItem('alertshow');
        if (res.status == 200) {
          setItemObj(res.data.product);
          setImageList(res.data.product_image);
          const user = await AsyncStorage.getItem('userDetail');
          setUserID(JSON.parse(user).user_id);
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
  const addCart = async cart_qty => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      if (cart_qty == null) {
        alert('Please select quanity');
      } else {
        if (parseInt(cart_qty) > parseInt(itemObj.quantity)) {
          alert('Not available in stock');
        } else {
          setLoading(true);
          GetApi(
            `add-cart?user_id=${user_id}&qty=${cart_qty}&product_id=${itemObj.id}`,
          ).then(
            //GetApi('add-cart?user_id=' + user_id + '&qty=' + cart_qty + '&product_id=' + ${itemObj.id}).then(
            async res => {
              setLoading(false);
              console.log('res.status');
              console.log(res.status);
              if (res.status == 200) {
                console.log('add in cart');
                //getItemDetail();
                props.navigation.navigate('ShopCart', {user_id: user_id});
              }
            },
            err => {
              setLoading(false);
              console.log(err);
            },
          );
        }
      }
    }
  };

  const submitReport = async () => {
    setReport('');
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    const data = {
      user_id: userId,
      type: 'Kanpid Shop',
      product_id: itemObj.id,
      message: report,
    };
    if (report == '') {
      Toaster('Please write something in report');
      return;
    }
    setLoading(false);
    Post(`post-report-product`, data).then(
      async res => {
        if (res.status == 200) {
          Toaster('Successfully Submitted Report');
          navigation.navigate('KanpidShop');
        } else {
          setLoading(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Spinner color={'#ffc000'} visible={loading} />

      <ScrollView>
        {/* Image code */}
        <View
          style={{
            width,
            height: 180,
            position: 'relative',
            paddingHorizontal: 20,
          }}>
          <ImageBackground
            resizeMode="contain"
            source={{
              uri:
                imageList.length > 1
                  ? Constants.imageUrl +
                    'category-image/' +
                    imageList[currentindex].image
                  : Constants.imageUrl +
                    'category-image/' +
                    itemObj.product_image,
            }}
            style={{width: width - 40, height: 180, marginTop: 10}}
            imageStyle={{borderRadius: 10}}>
            {imageList.length > 1 && (
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
                  <Ionicons name="chevron-forward" color={'white'} size={20} />
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>

          <TouchableOpacity
            style={[styles.iconView, {marginLeft: 5, marginTop: 10}]}
            onPress={() => {
              SharePost({
                post_id: itemObj.product_name,
                description: itemObj.product_description,
                title: itemObj.product_name,
                screen: 'ProductViewDetail',
                image:
                  Constants.imageUrl +
                  'category-image/' +
                  itemObj.product_image,
              }).then(res => {
                console.log(res);
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
                      uri: Constants.imageUrl + 'category-image/' + item.image,
                    }}
                    style={[styles.imageListView]}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* end image code */}
        <View
          style={{
            width,

            paddingHorizontal: 20,
          }}>
          <Text style={styles.pHeadingNew}>{itemObj.product_name}</Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: `${itemObj.product_description}`,
            }}
            tagsStyles={{
              body: {
                width: 300,
              },
              p: {
                color: '#6B6B6B',
                fontSize: 14,
                marginTop: 10,
                textAlign: 'justify',
              },
            }}
          />
          <Text style={styles.p3Heading}>
            <Text style={{color: '#000', fontSize: 15}}>Price :</Text> $
            {itemObj.product_price}{' '}
          </Text>
          <Text style={styles.p4Heading}>
            Category:{' '}
            <Text style={{fontSize: 16, marginTop: 10}}>
              {itemObj.cat_name}
            </Text>{' '}
          </Text>
        </View>

        <View style={styles.addCartCon}>
          <Text style={styles.p1Heading}>Quantity :</Text>
          <Dropdown
            style={[styles.dropdown, {borderColor: 'black', marginTop: 10}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={value}
            onChange={item => {
              setValue(item.value);
            }}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 25,
            paddingTop: 10,
          }}>
          <Text style={styles.stocks}>
            Total available in stock : {itemObj.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => {
              actionSheetRefReport.current?.setModalVisible();
            }}>
            <Text
              style={{
                color: '#103524',
                fontFamily: 'Mulish-SemiBold',
                fontWeight: '700',
              }}>
              REPORT THIS AD
            </Text>
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={actionSheetRefReport}
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

            <Text style={{color: '#4AAB7E', fontSize: 16}}>Report</Text>
            <TextInput
              placeholder="your message"
              style={{
                borderWidth: 1,
                borderColor: '#9e9e9eb8',
                placeholderStyle: '#9e9e9eb8',
                width: '90%',
                height: 100,
                borderRadius: 10,
                paddingLeft: 10,
                marginTop: 10,
              }}
              value={report}
              onChangeText={actualData => setReport(actualData)}
            />
            <TouchableOpacity
              style={{marginTop: 10}}
              onPress={() => {
                if (report?.length > 0) {
                  submitReport();
                } else {
                  Toaster('Blank report not been submited');
                }
              }}>
              <Text style={styles.actionBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
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
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          addCart(value);
        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>ADD TO CART</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductViewDetail;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 20,
  },

  deatailsContainer: {
    backgroundColor: '#f7f7f7',
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: '#FF0000',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#FF0000',
    //borderRadius: 5,
    marginTop: 10,
    //marginBottom: 1,
  },
  colorfirstsize: {
    fontSize: 12,
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 18,
    paddingRight: 15,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginTop: 5,
  },
  colorsize: {
    fontSize: 12,
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 18,
    paddingRight: 15,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 9,
  },
  firstsize: {
    fontSize: 12,
    borderWidth: 2,
    paddingTop: 8,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginTop: 5,
  },
  size: {
    fontSize: 12,
    borderWidth: 2,
    paddingTop: 8,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 9,
  },
  p1Heading: {
    fontSize: 14,
    marginTop: 5,
  },
  p4Heading: {
    fontSize: 13,
    marginTop: 5,
  },
  p3Heading1: {
    fontSize: 15,
    marginTop: 5,
    color: '#000',
  },
  p3Heading: {
    fontSize: 20,
    marginTop: 5,
    color: '#9ac96b',
    marginTop: 10,
  },
  p2Heading: {
    fontSize: 13,
    marginTop: 5,
  },
  paraHeading: {
    color: '#6B6B6B',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'justify',
  },
  pHeading: {
    fontSize: 17,
    marginTop: 10,
  },
  pHeadingNew: {
    fontSize: 17,
    color: '#000',
    marginTop: 10,
  },
  productImage: {
    marginTop: 10,
    width: 50,
    height: 50,
  },
  productImg: {
    alignSelf: 'center',
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  screenContainer: {
    paddingTop: 0,
    paddingRight: 20,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    marginTop: 10,
  },
  addCartCon: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 26,
    backgroundColor: '#9AC96D',
    width: 44,
    height: 44,
    paddingTop: 8,
    paddingLeft: 10,
    borderRadius: 30,
  },
  firstContainer: {
    flexDirection: 'row',
  },
  arrowHeading: {
    color: '#fff',
    fontSize: 16,
    marginTop: 9,
    marginLeft: 9,
  },
  topIcon: {
    marginRight: 10,
    fontSize: 30,
    color: '#9BCA6E',
    marginTop: -4,
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
  mainImage: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 5,
  },
  imageView: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
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
  plus: {
    backgroundColor: '#9AC96D',
    width: 20,
    paddingLeft: 6,
    fontSize: 15,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
  },
  minus: {
    backgroundColor: '#9AC96D',
    width: 20,
    paddingLeft: 8,
    fontSize: 15,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
  },
  num: {
    backgroundColor: '#F5F5F5',
    width: 30,
    paddingLeft: 4,
    fontSize: 10,
    paddingTop: 5,
    paddingLeft: 12,
    marginRight: 3,
  },

  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  stocks: {
    color: 'green',
    fontSize: 11,
  },
  actionMainView: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  actionBtn: {
    backgroundColor: '#4AAB7E',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});

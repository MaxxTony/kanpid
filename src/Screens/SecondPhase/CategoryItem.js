import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, createRef} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Post, GetApi} from '../../Helpers/Service';
import SharePost from '../../Component/SharePost';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native-paper';
import Spinner from '../../Component/Spinner';
import RenderHTML from 'react-native-render-html';
import ActionSheet from 'react-native-actions-sheet';
import Toaster from '../../Component/Toaster';
import Constants from '../../Helpers/constant';
import moment from 'moment';

const actionSheetRefReport = createRef();
const actionSheetRef = createRef();
const CategoryItem = ({route}) => {
  const navigation = useNavigation();
  const [currentindex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  const [oldCategoryProduct, setOldCategoryProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [user, setUser] = useState('');
  const [imageList, setImageList] = useState(images);
  const [report, setReport] = useState();
  const [itemDescription, setItemDescription] = useState('');

  const name = route.params.itemName;
  console.log(name, '+_+_+_+_+_+');

  const images = [
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/viewphone.png'),
    require('../../assets/Images/phone1.png'),
    require('../../assets/Images/phone2.png'),
    require('../../assets/Images/viewphone.png'),
  ];

  const getOldCategoryProduct = async () => {
    GetApi(`used-item/detail-page/${name}`).then(
      async res => {
        if (res.status == 200) {
          setOldCategoryProduct(res.data.product);
          setRelatedProduct(res.data.related_product);
          setIsLoaded(false);
          setImageList(res.data.product_image);
          setItemDescription(res.data.product.product_description);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const source = {
    html: `${itemDescription}`,
  };

  useEffect(() => {
    getOldCategoryProduct();
  }, []);

  const getuserDetail = async (id, chatId) => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      chatClick(id, JSON.parse(user).user_id);
    }
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
          navigation.navigate('Chat', {
            chatUser_id: oldCategoryProduct.user_id,
            user_img: oldCategoryProduct.user_profile_image,
            user_name: oldCategoryProduct.first_name,
          });
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const userValue = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    setUser(userId);
  };
  userValue();

  const submitReport = async () => {
    setReport('');
    const user = await AsyncStorage.getItem('userDetail');
    if (user == null) {
      Toaster('Please Login First');
      return false;
    }
    const userId = JSON.parse(user).user_id;

    const data = {
      user_id: userId,
      type: 'Used Item',
      product_id: oldCategoryProduct.id,
      message: report,
    };
    if (report === '') {
      Toaster('Please provide some info in the report ');
      return;
    }

    setLoading(false);
    Post(`post-report-product`, data).then(
      async res => {
        if (res.status == 200) {
          Toaster('Successfully Submitted Report');
          navigation.navigate('UsedItemMain');
        } else {
          setLoading(false);
          console.log('err', err);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const getDetail = async id => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      actionSheetRefReport.current?.setModalVisible();
    }
  };

  return (
    <View>
      <ScrollView style={{marginBottom: 0}}>
        {/* <Spinner color={'#ffc000'} visible={isLoaded} /> */}

        <View style={styles.screenContainer}>
          <Image
            resizeMode="contain"
            source={{
              uri:
                Constants.imageUrl +
                'category-image/' +
                oldCategoryProduct.product_image,
            }}
            style={styles.productImg}
          />
          <TouchableOpacity
            style={[styles.iconView, {marginLeft: 5, marginTop: 10}]}
            onPress={() => {
              console.log(oldCategoryProduct);
              SharePost({
                post_id: oldCategoryProduct.product_name,
                description: oldCategoryProduct.product_description,
                title: oldCategoryProduct.product_name,
                screen: 'CategoryItem',
                image:
                  'https://www.kanpid.lk/assets/admin_assets/category-image/' +
                  oldCategoryProduct.product_image,
              }).then(res => {
                console.log('share responces', res);
              });
            }}>
            <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.mainHeading}>
              {oldCategoryProduct.product_name}
            </Text>
            <Text style={styles.price}>
              Rs{oldCategoryProduct.product_price}
            </Text>
          </View>
          <Text style={styles.paraHeading}>{oldCategoryProduct.cat_name}</Text>
          <Text>{moment(oldCategoryProduct.created_at).format('DD-MM-Y')}</Text>
        </View>
        <View style={styles.desView}>
          <RenderHTML
            contentWidth={width}
            source={source}
            // allowedStyles={{width: 320}}
            tagsStyles={{
              body: {
                width: 300,
              },
              p: {
                color: '#6B6B6B',
                fontSize: 16,
                fontWeight: 'bold',
              },
            }}
          />
        </View>

        {oldCategoryProduct.user_chat_id == user ? (
          <View
            style={{
              backgroundColor: '#103524',
              padding: 10,
              margin: 20,
              borderRadius: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                textTransform: 'capitalize',
                fontSize: 15,
              }}>
              This is your product
            </Text>
          </View>
        ) : (
          <View
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: '#9ac96e',
              margin: 20,
              borderRadius: 10,
              backgroundColor: '#9ac96e',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View>
                <Image
                  resizeMode="contain"
                  source={{
                    uri:
                      Constants.imageUrl +
                      'images/' +
                      oldCategoryProduct.user_image,
                  }}
                  style={styles.userImg}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 10,
                    marginLeft: 15,
                    width: 150,
                    color: '#fff',
                  }}>
                  {oldCategoryProduct.user_name}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    marginLeft: 15,
                    width: 170,
                    color: '#fff',
                  }}>
                  Member Since {oldCategoryProduct.user_created_date}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    width: 170,
                    marginTop: 4,
                    color: '#fff',
                  }}>
                  {' '}
                  <Feather
                    name="map-pin"
                    style={{fontSize: 15, color: '#fff'}}
                  />{' '}
                  {oldCategoryProduct.user_address}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    width: 170,
                    marginTop: 4,
                    color: '#fff',
                  }}>
                  {' '}
                  <Feather
                    name="phone"
                    style={{fontSize: 15, color: '#fff'}}
                  />{' '}
                  {oldCategoryProduct.user_phone}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    width: 170,
                    marginTop: 4,
                    color: '#fff',
                  }}>
                  {' '}
                  <Feather
                    name="user-check"
                    style={{fontSize: 15, color: '#fff'}}
                  />{' '}
                  Verified Seller Visit Member Shop
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatbtn}
              onPress={() => {
                getuserDetail(oldCategoryProduct.user_id);
              }}>
              <Text style={{textAlign: 'center', color: '#fff', fontSize: 15}}>
                Chat With "{oldCategoryProduct.user_name}"
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                getDetail(oldCategoryProduct.user_id);
                // if (user == null) {
                //   actionSheetRef.current?.setModalVisible();
                // } else {
                //   actionSheetRefReport.current?.setModalVisible();
                // }
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                Report This Add
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <View style={styles.relatedView}>
          <Text style={{fontSize: 15}}>Related Products</Text>

          <View>
            <FlatList
              horizontal
              data={relatedProduct}
              renderItem={({item}) => {
                return (
                  <View>
                    <View
                      style={{
                        margin: 10,
                        paddingTop: 15,
                        padding: 10,
                        paddingBottom: 20,
                        backgroundColor: '#fff',
                        marginLeft: 0,
                        elevation: 4,
                        borderRadius: 7,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.push('CategoryItem', {
                            itemName: item.product_name,
                          })
                        }>
                        <Image
                          resizeMode="contain"
                          source={{
                            uri:
                              Constants.imageUrl +
                              'category-image/' +
                              item.product_image,
                          }}
                          style={styles.reImg}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 10,
                          width: 140,
                          marginLeft: 5,
                        }}>
                        {item.product_name}
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                          marginLeft: 5,
                          marginRight: 5,
                        }}>
                        <Text style={{fontSize: 12, color: '#9ac96e'}}>
                          $700
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('CategoryItem', {
                              itemName: item.product_name,
                            })
                          }>
                          <Text
                            style={{
                              color: '#9a9a9a',
                              fontSize: 12,
                              borderBottomWidth: 1,
                              borderBottomColor: '#e6e6e6',
                            }}>
                            View Picks
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}></FlatList>
          </View>
        </View>
      </ScrollView>
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
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  loader: {
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AAB7E',
    position: 'absolute',
    left: 25,
    top: 23,
  },
  relatedView: {
    margin: 20,
    marginRight: 0,
  },
  reImg: {
    width: 140,
    height: 150,
    borderRadius: 7,
  },
  chatbtn: {
    backgroundColor: '#ff5868',
    margin: 10,
    padding: 15,
    borderRadius: 5,
  },
  desView: {
    marginStart: 20,
  },
  userImg: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  relatedImg: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  productImg: {
    alignSelf: 'center',
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  paraHeading: {
    color: '#6B6B6B',
    fontSize: 14,
    marginTop: -10,
  },
  paraHeading1: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 10,
    width: 320,
  },
  mainHeading: {
    color: '#000',
    fontSize: 15,
    marginTop: 10,
    width: 240,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: '#FF0000',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#FF0000',
    borderRadius: 5,
    marginTop: 15,
  },
  price: {
    fontSize: 14,
    marginTop: 10,
    backgroundColor: '#9ac96e',
    color: '#fff',
    textAlign: 'center',
    height: 30,
    paddingTop: 4,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  gallery: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginLeft: 5,
  },
  galleryView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 7,
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

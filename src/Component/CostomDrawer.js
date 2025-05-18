import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-paper';
import Constants from '../Helpers/constant';
import {Post} from '../Helpers/Service';
import Toaster from '../Component/Toaster';
import Spinner from '../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import MyUsedItem from '../Screens/SecondPhase/MyUsedItem';
import {ScrollView} from 'react-native-gesture-handler';

const CostomDrawer = props => {
  // console.log(props);
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getuserDetail();
    // }, [props.navigation.state?.isDrawerOpen]);
  }, [props.navigation.getState()]);

  const getuserDetail = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    // console.log(JSON.parse(user));
    setUserDetail(JSON.parse(user));
  };
  const userMembership = () => {
    navigation.navigate('Membership');
  };
  const userWishlist = () => {
    navigation.navigate('Wishlist');
  };
  const shopWishlist = () => {
    navigation.navigate('Shopwishlist');
  };
  const myUsedItem = () => {
    navigation.navigate('Myuseditem');
  };
  const postAdd = () => {
    navigation.navigate('UploadUsedItem');
  };
  const promotedItems = () => {
    navigation.navigate('PromotedItems');
  };
  const navigation = useNavigation();

  const logoutUser = () => {
    const d = {
      user_id: userDetail.user_id,
    };
    Post('logout', d).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          await AsyncStorage.removeItem('userDetail');
          // Toaster(res.message);
          props.navigation.push('main');
          props.navigation.closeDrawer();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const sideBardata = [
    {
      key: 'About Kanpid',
      nav: 'AboutKanpid',
    },
    {
      key: 'Support',
      nav: 'Support',
    },
    {
      key: 'Privacy Policy',
      url: 'https://www.kanpid.lk/privacy',
    },
    {
      key: 'Legal',
      url: 'https://www.kanpid.lk/terms',
    },
    {
      key: 'NewsLetter',
      nav: 'NewsLetter',
    },
    {
      key: 'Delete Account',
      nav: 'DeleteAccount',
    },
  ];

  const onPressMenu = item => {
    props.navigation.closeDrawer();
    // console.log(item.url);
    if (item.url !== undefined) {
      Linking.openURL(item.url);
    } else if (item.nav !== undefined) {
      props.navigation.navigate(item.nav);
    }
  };

  const myShopcart = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    navigation.navigate('ShopCart', {user_id: userId});
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, marginTop: 0}}>
        <Spinner color={'#fff'} visible={loading} />
        <DrawerContentScrollView
          {...props}
          style={{paddingBottom: 20, borderWidth: 0}}>
          <View style={{position: 'relative', paddingTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 10,
                marginLeft: 20,
              }}>
              <Avatar.Image
                size={60}
                source={
                  userDetail?.image != null
                    ? {uri: `${Constants.imageUrl}images/${userDetail.image}`}
                    : require('../assets/Images/images.png')
                }
              />
              <View style={{justifyContent: 'center', paddingHorizontal: 15}}>
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Mulish-SemiBold',
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Hi Welcome
                </Text>
                {userDetail?.user_id === undefined ? (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.closeDrawer();
                      props.navigation.navigate('Signin');
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Mulish-Bold',
                        fontSize: 13,
                        padding: 8,
                        paddingVertical: 4,
                        textAlign: 'center',
                        marginTop: 10,
                        backgroundColor: '#103524',
                        borderRadius: 30,
                      }}>
                      {/* {userDetail?.user_id} */}
                      Login
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        fontFamily: 'Mulish-Bold',
                        fontSize: 16,
                      }}>
                      {userDetail?.first_name}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={{position: 'absolute', right: 20, top: 30}}
              onPress={() => {
                props.navigation.closeDrawer();
              }}>
              <FontAwesome5 name="arrow-right" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 30}}>
            {userDetail?.user_id !== undefined && (
              <View
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                  borderColor: '#d6d6d6',
                  borderTopWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    marginLeft: 15,
                    fontFamily: 'Mulish-Bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  Kanpid Shop
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    myShopcart();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Cart
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    shopWishlist();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Wishlist
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    navigation.navigate('YourOrders');
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Orders
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {userDetail?.user_id !== undefined && (
              <View
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                  borderColor: '#d6d6d6',
                  borderTopWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    marginLeft: 15,
                    fontFamily: 'Mulish-Bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  Used Item
                </Text>

                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    postAdd();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    Post Your Add
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    userWishlist();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Wishlist
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    myUsedItem();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Items
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    promotedItems();
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 13,
                      color: '#000',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    My Promoted Items
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <FontAwesome5 name="angle-right" color={'#000'} size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {userDetail?.user_id !== undefined && (
              <TouchableOpacity
                style={{
                  padding: 5,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderRadius: 20,
                  marginHorizontal: 10,
                  marginBottom: 10,
                  backgroundColor: '#103524',
                  marginTop: 10,
                }}
                onPress={() => {
                  userMembership();
                }}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 15,
                    color: '#fff',
                    fontFamily: 'Mulish-Bold',
                  }}>
                  Membership
                </Text>
              </TouchableOpacity>
            )}
            {sideBardata
              .filter(item => {
                if (item.key === 'Delete Account') {
                  return userDetail?.user_id !== undefined;
                }
                return true;
              })
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 5,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderRadius: 20,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    backgroundColor: '#103524',
                  }}
                  onPress={() => {
                    onPressMenu(item);
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      color: '#fff',
                      fontFamily: 'Mulish-Bold',
                    }}>
                    {item.key}
                  </Text>
                </TouchableOpacity>
              ))}
            {userDetail?.user_id !== undefined && (
              <TouchableOpacity
                style={{
                  padding: 5,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderRadius: 20,
                  marginHorizontal: 10,
                  marginBottom: 10,
                  backgroundColor: '#103524',
                }}
                onPress={() => {
                  logoutUser();
                }}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 15,
                    color: '#fff',
                    fontFamily: 'Mulish-Bold',
                  }}>
                  Logout
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* <DrawerItemList {...props} /> */}

          <View style={{padding: 10}}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate('FollowUs');
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  color: '#103524',
                  fontFamily: 'Mulish-Bold',
                  fontWeight: 'bold',
                  marginBottom: 10,
                  textTransform: 'uppercase',
                }}>
                Follow Us
              </Text>
            </TouchableOpacity>
            <View
              style={[
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 10,
                },
              ]}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  paddingHorizontal: 15,
                  backgroundColor: '#103524',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={async () => {
                  await Linking.openURL('https://www.facebook.com/kanpidd/');
                }}>
                <FontAwesome5 name="facebook-f" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#103524',
                  borderRadius: 100,
                  justifyContent: 'center',
                  marginRight: 10,
                  alignItems: 'center',
                }}
                onPress={async () => {
                  await Linking.openURL(
                    'https://twitter.com/Kanpid_?t=qYwxN9hphE8XT5hub9CTyA&s=09',
                  );
                }}>
                <Ionicons name="logo-twitter" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#103524',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={async () => {
                  await Linking.openURL(
                    // 'https://www.instagram.com/kanpid_/ '
                    'https://www.instagram.com/kanpid_limited/',
                  );
                }}>
                <Ionicons name="logo-instagram" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#103524',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={async () => {
                  await Linking.openURL(
                    'https://www.linkedin.com/company/kanpid-limited',
                  );
                }}>
                <FontAwesome5 name="linkedin-in" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </DrawerContentScrollView>
      </View>
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  folow: {
    backgroundColor: '#CFE9D9',
    paddingTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 45,
    paddingHorizontal: 10,
  },
  submit: {
    marginTop: 20,
    textAlign: 'center',
    width: 90,
  },
  submitText: {
    paddingTop: 5,
    paddingBottom: 5,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 14,
  },
  menuBtn: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    opacity: 0.8,
  },
});

export default CostomDrawer;

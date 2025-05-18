import React, {useEffect, useState} from 'react';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Spinner from '../Component/Spinner';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SignIn from '../Screens/Auth/SignIn';
import SignUp from '../Screens/Auth/SignUp';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import Home from '../Screens/MainScreens/Home';
import Notification from '../Screens/MainScreens/Notification';
import Inbox from '../Screens/MainScreens/Inbox';
import Profile from '../Screens/MainScreens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditProfile from '../Screens/MainScreens/EditProfile';
import Chat from '../Screens/MainScreens/Chat';
import Searchresult from '../Screens/MainScreens/Searchresult';
import ProductView from '../Screens/MainScreens/ProductView';
import CostomDrawer from '../Component/CostomDrawer';
import AboutKanpid from '../Screens/MainScreens/AboutKanpid';
import Support from '../Screens/MainScreens/Support';
import FollowUs from '../Screens/MainScreens/FollowUs';
import PostYourItem from '../Screens/MainScreens/PostYourItem';
import OtpVerify from '../Screens/Auth/OtpVerify';
import ChangePassword from '../Screens/Auth/ChangePassword';
import NewsLetter from '../Screens/MainScreens/NewsLetter';
import SplashScreen from 'react-native-splash-screen';
import DeleteAccount from '../Screens/MainScreens/DeleteAccount';
import OneSignal from 'react-native-onesignal';
import HomeNew from '../Screens/SecondPhase/HomeNew';
import ProductViewDetail from '../Screens/SecondPhase/ProductViewDetail';
import Shop from '../Screens/SecondPhase/Shop';
import KanpidShop from '../Screens/SecondPhase/KanpidShop';
import ShopCart from '../Screens/SecondPhase/ShopCart';
import UsedItemMain from '../Screens/SecondPhase/UsedItemMain';
import ShopAddress from '../Screens/SecondPhase/ShopAddress';
import Thankyou from '../Screens/SecondPhase/Thankyou';
import PaymentPage from '../Screens/SecondPhase/PaymentPage';
import UsedItemCategory from '../Screens/SecondPhase/UsedItemCategory';
import CategoryItem from '../Screens/SecondPhase/CategoryItem';
import UploadUsedItem from '../Screens/SecondPhase/UploadUsedItem';
import Wishlist from '../Screens/SecondPhase/Wishlist';
import Membership from '../Screens/SecondPhase/Membership/Membership';
import Shopwishlist from '../Screens/SecondPhase/Shopwishlist';
import MyUsedItem from '../Screens/SecondPhase/MyUsedItem';
import PromotedItems from '../Screens/SecondPhase/PromotedItems';
import PromoteAds from '../Screens/SecondPhase/PromoteAds';
import EditUsedItem from '../Screens/SecondPhase/EditUsedItem';
import UsedItemUploadImage from '../Screens/SecondPhase/UsedItemUploadImage';
import {DrawerActions} from '@react-navigation/native';
import UsedThankYou from '../Screens/SecondPhase/UsedThankYou';
import YourOrders from '../Screens/SecondPhase/YourOrders';
import OrderDetails from '../Screens/SecondPhase/OrderDetails';
import Logo from '../assets/img/Logo';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const MainRoutes = props => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(openedEvent => {
      const {notification} = openedEvent;
      if (notification?.additionalData?.type === 'ITEM') {
        navigation.navigate('ProductView', {
          itemId: notification?.additionalData?.item_id,
        });
      }
      if (notification?.additionalData?.type === 'CHAT') {
        navigation.navigate('Chat', {
          chatUser_id: notification?.additionalData?.user_id,
          user_img: notification?.additionalData?.user_profile_image,
          user_name: notification?.additionalData?.first_name,
        });
      }
    });
  }, [OneSignal]);

  const handleDynamicLink = link => {
    if (link != undefined) {
      const parts = link.url.split('/');
      const productNameWithQuery = parts[parts.length - 1];
      const itemId = productNameWithQuery.split('?')[0];

      const match = link.url.match(/screen=([^&]*)/);
      let screenParam;

      if (match && match[1]) {
        screenParam = match[1];
        console.log(screenParam, 'item screen name'); // Output: ProductViewDetail
      } else {
        console.log('screen parameter not found');
      }

      console.log('item id h ', itemId);
      SplashScreen.hide();
      if (navigation.isReady()) {
        if (screenParam == 'ProductViewDetail') {
          navigation.navigate('ProductViewDetail', {itemId});
        }
        if (screenParam == 'ProductView') {
          navigation.navigate('ProductView', {itemId});
        }
        if (screenParam == 'CategoryItem') {
          navigation.navigate('CategoryItem', {name: itemId});
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log('dynamic link is', link);
        if (link != undefined) {
          const parts = link.url.split('/');
          const productNameWithQuery = parts[parts.length - 1];
          const itemId = productNameWithQuery.split('?')[0];

          const match = link.url.match(/screen=([^&]*)/);
          let screenParam;

          if (match && match[1]) {
            screenParam = match[1];
            console.log(screenParam, 'item screen name'); // Output: ProductViewDetail
          } else {
            console.log('screen parameter not found');
          }

          console.log('item id h ', itemId);
          SplashScreen.hide();
          if (navigation.isReady()) {
            if (screenParam == 'ProductViewDetail') {
              navigation.navigate('ProductViewDetail', {itemId});
            }
            if (screenParam == 'ProductView') {
              navigation.navigate('ProductView', {itemId});
            }
            if (screenParam == 'CategoryItem') {
              navigation.navigate('CategoryItem', {name: itemId});
            }
          }
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const stacOpt = title => {
    const opt = {
      title,
      headerStyle: {backgroundColor: '#103524', height: 60},
      headerBackVisible: false,
      headerTitleStyle: {
        color: 'white',
        fontFamily: 'Mulish-Bold',
        fontSize: 16,
      },
      headerLeft: () => (
        <View>
          <TouchableOpacity
            style={[styles.backArow, {marginLeft: 0, marginRight: 20}]}
            onPress={() => {
              navigation.goBack();
            }}>
            <FontAwesome5 name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    };
    return opt;
  };

  const taboption = (title, icon) => {
    const opt = {
      title,
      tabBarIcon: ({focused}) => (
        <Ionicons
          name={icon}
          size={22}
          color={focused ? '#9AC96A' : 'rgba(255, 255, 255, 0.5)'}
        />
      ),

      tabBarLabelStyle: {
        fontSize: 12,
        marginTop: -10,
        fontWeight: '700',
        fontFamily: 'Mulish-Regular',
      },
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        height: 60,
        elevation: 24,
        backgroundColor: '#103524',
        paddingBottom: 10,
        fontSize: 16,

        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {
          height: 5,
        },
        elevation: 4,
        zIndex: -1,
      },

      headerShown: icon == 'person-outline' ? false : true,
      safeAreaInset: {
        bottom: 'always',
      },

      headerStyle: {backgroundColor: '#103524', height: 60},

      headerLeft: () => (
        <View>
          {icon == 'home-outline' ? (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Image source={require('../assets/Images/menu.png')} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.backArow}
              onPress={() => {
                navigation.goBack();
              }}>
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      ),

      headerRight: () => (
        <View>
          {icon == 'home-outline' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('main', {
                    screen: 'tabs',
                    params: {screen: 'Notification'},
                  });
                }}>
                <Ionicons
                  name="notifications-outline"
                  color={'#9AC96D'}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
      headerTitleAlign: 'center',
      headerTitle: props => {
        if (icon == 'home-outline') {
          return <Logo />;
        } else {
          return (
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontFamily: 'Mulish-Medium',
              }}>
              {title}
            </Text>
          );
        }
      },
    };
    return opt;
  };

  return (
    <>
      <Spinner color={'#fff'} visible={loading} />
      <Stack.Navigator>
        <Stack.Screen name="main" options={{headerShown: false}}>
          {() => (
            <Drawer.Navigator
              initialRouteName="tabs"
              drawerContent={props => <CostomDrawer {...props} />}
              drawerStyle={{width: '80%'}}
              backBehavior="history"
              screenOptions={{
                drawerActiveBackgroundColor: 'transparent',
                drawerItemStyle: {
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1,
                  width: '100%',
                  marginLeft: 0,
                  marginTop: 0,
                  opacity: 0.7,
                  paddingLeft: 10,
                  paddingBottom: 5,
                  fontFamily: 'OpenSans-SemiBold',
                },
                swipeEnabled: false,
                // drawerHideStatusBarOnOpen: true,
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#fff',
                drawerLabelStyle: {
                  marginLeft: -10,
                  color: '#fff',
                  fontSize: 16,
                },
              }}>
              <Drawer.Screen name="tabs" options={{headerShown: false}}>
                {() => (
                  <Tab.Navigator 
                    initialRouteName="KanpidShop"
                    backBehavior="history"
                    screenOptions={{
                      tabBarHideOnKeyboard: true,
                      tabBarActiveTintColor: '#9AC96A',
                    }}>
                    <Tab.Screen
                      name="KanpidShop"
                      options={taboption('Home', 'home-outline')}
                      component={KanpidShop}
                    />
                    <Tab.Screen
                      name="Notification"
                      options={taboption(
                        'Notification',
                        'notifications-outline',
                      )}
                      component={Notification}
                    />
                    <Tab.Screen
                      name="Inbox"
                      options={taboption('Inbox', 'chatbox-outline')}
                      component={Inbox}
                    />
                    <Tab.Screen
                      name="Account"
                      options={taboption('Account', 'person-outline')}
                      component={Profile}
                    />
                  </Tab.Navigator>
                )}
              </Drawer.Screen>
            </Drawer.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen
          options={{headerShown: false}}
          name="Signin"
          component={SignIn}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OtpVerify"
          component={OtpVerify}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen options={stacOpt('')} name="Chat" component={Chat} />
        <Stack.Screen
          options={stacOpt('Search result')}
          name="SerarchResult"
          component={Searchresult}
        />
        <Stack.Screen
          options={stacOpt('')}
          name="ProductView"
          component={ProductView}
        />
        <Stack.Screen
          options={stacOpt('About Kanpid')}
          name="AboutKanpid"
          component={AboutKanpid}
        />
        <Stack.Screen
          options={stacOpt('Support')}
          name="Support"
          component={Support}
        />
        <Stack.Screen
          options={stacOpt('Delete Account')}
          name="DeleteAccount"
          component={DeleteAccount}
        />
        <Stack.Screen
          options={stacOpt('Membership')}
          name="Membership"
          component={Membership}
        />
        <Stack.Screen
          options={stacOpt('NewsLetter')}
          name="NewsLetter"
          component={NewsLetter}
        />
        <Stack.Screen
          options={stacOpt('Follow us')}
          name="FollowUs"
          component={FollowUs}
        />
        <Stack.Screen
          options={stacOpt('Post Your Item')}
          name="PostYourItem"
          component={PostYourItem}
        />
        {/* Second phase */}
        <Stack.Screen options={stacOpt('')} name="Home" component={Home} />
        <Stack.Screen
          options={stacOpt('Product Detail')}
          name="ProductViewDetail"
          component={ProductViewDetail}
        />
        <Stack.Screen
          options={stacOpt('Kanpid Shop Product')}
          name="Shop"
          component={Shop}
        />
        <Stack.Screen
          options={stacOpt('Kanpid Shop')}
          name="KanpidShop"
          component={KanpidShop}
        />
        <Stack.Screen
          options={stacOpt('Cart')}
          name="ShopCart"
          component={ShopCart}
        />
        <Stack.Screen
          options={stacOpt('Shipping Address')}
          name="ShopAddress"
          component={ShopAddress}
        />
        <Stack.Screen
          options={stacOpt('Used Item')}
          name="UsedItemMain"
          component={UsedItemMain}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Thankyou"
          component={Thankyou}
        />
        <Stack.Screen
          options={stacOpt('Payment')}
          name="PaymentPage"
          component={PaymentPage}
        />
        <Stack.Screen
          options={stacOpt('Used Item Product')}
          name="UsedItemCategory"
          component={UsedItemCategory}
        />
        <Stack.Screen
          options={stacOpt('Product')}
          name="CategoryItem"
          component={CategoryItem}
        />
        <Stack.Screen
          options={stacOpt('Wishlist')}
          name="Wishlist"
          component={Wishlist}
        />
        <Stack.Screen
          options={stacOpt('Upload Used Item')}
          name="UploadUsedItem"
          component={UploadUsedItem}
        />
        <Stack.Screen
          options={stacOpt('Shop Wishlist')}
          name="Shopwishlist"
          component={Shopwishlist}
        />
        <Stack.Screen
          options={stacOpt('My Used Item')}
          name="Myuseditem"
          component={MyUsedItem}
        />
        <Stack.Screen
          options={stacOpt('Promoted Ads')}
          name="PromotedAds"
          component={PromoteAds}
        />

        <Stack.Screen
          options={stacOpt('Promoted Items')}
          name="PromotedItems"
          component={PromotedItems}
        />
        <Stack.Screen
          options={stacOpt('Edit Used Item')}
          name="EditUsedItem"
          component={EditUsedItem}
        />
        <Stack.Screen
          options={stacOpt('Upload Image')}
          name="UsedItemUploadImage"
          component={UsedItemUploadImage}
        />
        <Stack.Screen
          options={stacOpt('Thank You')}
          name="UsedThankYou"
          component={UsedThankYou}
        />
        <Stack.Screen
          options={stacOpt('My Orders')}
          name="YourOrders"
          component={YourOrders}
        />
        <Stack.Screen
          options={stacOpt('Order Details')}
          name="OrderDetails"
          component={OrderDetails}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  backArow: {
    backgroundColor: '#9AC96D',
    height: 35,
    width: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30,
    marginLeft: 20,
  },
});

export default MainRoutes;

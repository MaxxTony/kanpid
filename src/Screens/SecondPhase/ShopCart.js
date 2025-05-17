import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Spinner from '../../Component/Spinner';
import {Post, GetApi} from '../../Helpers/Service';
import Constants from '../../Helpers/constant';
import {useNavigation} from '@react-navigation/native';
import Toaster from '../../Component/Toaster';

const actionSheetRef = createRef();

const ShopCart = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [cartValue, setTotalCartvalue] = useState([]);
  const [user_id, setUserID] = useState();
  const [myAlert, setMyAlert] = useState();

  useEffect(() => {
    setUserID(props?.route?.params?.user_id);
    if (user_id != undefined) {
      getCartItem();
    }
  }, [user_id]);

  const getCartItem = () => {
    setLoading(true);
    GetApi(`cart-list?user_id=${user_id}`).then(
      async res => {
        console.log('-------------------');
        setLoading(false);
        if (res.status == 200) {
          setCartItem(res.data.cart);
          setTotalCartvalue(res.data.cart_total);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const outStock = () => {
    Toaster('Out Of Stock');
  };
  const updateCartPlus = async cart_id => {
    setLoading(true);
    GetApi(`cart-update?cart_id=${cart_id}&type=plus`).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          if (res.data.data == 'false') {
            outStock();
          } else {
            getCartItem();
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const updateCartMinus = async cart_id => {
    console.log(cart_id);
    console.log('minus');
    setLoading(true);
    GetApi(`cart-update?cart_id=${cart_id}&type=minus`).then(
      async res => {
        setLoading(false);
        console.log('res.status');
        console.log(res.status);
        if (res.status == 200) {
          console.log('add in cart');
          getCartItem();
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  return (
    <View>
      {cartValue === 0 ? (
        <View
          style={{
            padding: 30,
          }}>
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            Your shop cart is empty
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('KanpidShop');
            }}
            style={{
              backgroundColor: '#103524',
              padding: 10,
              marginRight: 40,
              marginLeft: 40,
              marginTop: 10,
              fontSize: 16,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                }}>
                {' '}
                Continue Shopping
              </Text>
              <AntDesign
                name="shoppingcart"
                style={{
                  color: '#fff',
                  fontSize: 16,
                  marginTop: 3,
                  marginLeft: 5,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{backgroundColor: '#fff', height: '100%'}}>
          <Spinner color={'#fff'} visible={loading} />
          <ScrollView>
            <View style={styles.mainContainer}>
              <Text style={{color: '#9AC96D'}}>Cart Products</Text>

              {cartItem.map((item, index) => (
                <View style={styles.boxProduct}>
                  <View>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          Constants.imageUrl +
                          'category-image/' +
                          item.product_image,
                      }}
                      style={styles.flatImg}
                    />
                  </View>
                  <View style={{paddingLeft: 10, width: 210}}>
                    <Text>{item.product_name}</Text>

                    <View style={{flexDirection: 'row', marginTop: 3}}>
                      <Text style={{color: '#81B153', fontSize: 14}}>
                        ${item.product_price}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 12}}>Qty:</Text>
                      <View style={{flexDirection: 'row', marginLeft: 15}}>
                        <TouchableOpacity
                          onPress={() => updateCartMinus(item.cart_id)}>
                          <Text style={styles.plus}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.num}>{item.cart_quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateCartPlus(item.cart_id)}>
                          <Text style={styles.minus}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <Text style={{textAlign: 'center', marginTop: 30}}>
                Total : $ {cartValue}
              </Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  navigation.navigate('ShopAddress', {
                    user_id: user_id,
                    amount: cartValue,
                  });
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  CHECKOUT
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ShopCart;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
  },
  addBtn: {
    backgroundColor: '#FFC000',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#FFC000',
    borderRadius: 5,
    marginTop: 7,
  },
  boxProduct: {
    margin: 10,
    marginLeft: 0,
    padding: 10,
    borderWidth: 1,
    borderColor: '#9AC96D',
    borderRadius: 10,
    flexDirection: 'row',
  },
  removeBtn: {
    backgroundColor: '#FF0000',
    color: '#fff',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    marginLeft: 25,
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
  flatImg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 70,
    height: 70,
  },
});

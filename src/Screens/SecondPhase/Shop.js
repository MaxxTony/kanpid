import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import Spinner from '../../Component/Spinner';
import {Post, GetApi} from '../../Helpers/Service';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const actionSheetRef = createRef();
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReadMore from 'react-native-read-more-text';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Toaster from '../../Component/Toaster';
import {Dropdown} from 'react-native-element-dropdown';
import {color} from 'react-native-reanimated';

const Shop = props => {
  const navigation = useNavigation();
  const [product, SetProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchProductName, setSearchProductName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [user_id, setUserID] = useState();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterName, setFilterName] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    setCategoryName(props?.route?.params?.categoryName);
    setUserID(props?.route?.params?.user_id);
    getShopItemByCategory();
  }, [categoryName]);

  const getShopItemByCategory = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      setUserID(0);
    } else {
      setUserID(JSON.parse(user).user_id);
    }

    GetApi(
      `shop-item-search?category=${categoryName}&current_user_id=${user_id}`,
    ).then(
      async res => {
        if (res.status == 200) {
          SetProduct(res.data.all_item);
          setIsLoaded(false);
          const user = await AsyncStorage.getItem('userDetail');
          if (user === null) {
            setUserID(0);
          } else {
            setUserID(JSON.parse(user).user_id);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const searchByName = async product_name => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      setUserID(0);
    } else {
      setUserID(JSON.parse(user).user_id);
    }

    GetApi(
      'shop-item-search?product_name=' +
        product_name +
        '&current_user_id=' +
        user_id,
    ).then(
      async res => {
        if (res.status == 200) {
          SetProduct(res.data.all_item);
          const user = await AsyncStorage.getItem('userDetail');
          if (user === null) {
            setUserID(0);
          } else {
            setUserID(JSON.parse(user).user_id);
          }
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const addFav = async product_id => {
    const user = await AsyncStorage.getItem('userDetail');

    if (user == null) {
      Toaster('Please login your account');
      return;
    }
    const userId = JSON.parse(user).user_id;
    if (userId == 0) {
      Toaster('Please login your account');
      return;
    } else {
      //setLoading(true);

      GetApi(
        `shop-add-favourite?user_id=${userId}&product_id=${product_id}`,
      ).then(
        async res => {
          //setLoading(false);
          if (res.status == 200) {
            Toaster('Added To WishList');
            searchData();
            console.log('insert');
          } else {
            Toaster('Remove From WishList');
            searchData();
            console.log('delete');
          }
        },
        err => {
          //setLoading(false);
          console.log(err);
        },
      );
    }
  };

  const searchData = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      setUserID(0);
    } else {
      setUserID(JSON.parse(user).user_id);
    }

    GetApi(
      `shop-item-search?&product_name=${filterName}&min_price=${minPrice}&max_price=${maxPrice}&current_user_id=${user_id}`,
    ).then(
      async res => {
        if (res.status == 200) {
          SetProduct(res.data.all_item);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  return (
    <View style={{backgroundColor: '#fff'}}>
      {/* <Spinner color={'#ffc000'} visible={loading} /> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        <TextInput
          placeholder="Find Cars, Mobile Phones and more..."
          style={styles.searchInput}
          value={searchProductName}
          onChangeText={actualData => setSearchProductName(actualData)}
        />
        <TouchableOpacity
          onPress={() => {
            searchByName(searchProductName);
          }}>
          <EvilIcons name="search" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <View style={{marginLeft: 20, marginRight: 20, paddingBottom: 10}}>
        <Text style={{fontSize: 13, marginLeft: 2}}>Filter By Price:</Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputLarge}
              value={filterName}
              onChangeText={actualData => setFilterName(actualData)}
            />
            <Text style={styles.inputHeading}>Name:</Text>
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputLarge}
              value={minPrice}
              onChangeText={actualData => setMinPrice(actualData)}
            />
            <Text style={styles.inputHeading}>Min Price:</Text>
          </View>

          <View></View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputLarge}
              value={maxPrice}
              onChangeText={actualData => setMaxPrice(actualData)}
            />
            <Text style={styles.inputHeading}>Max Price:</Text>
          </View>

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#4aab7e',
                padding: 8,
                borderRadius: 4,
                width: 150,
              }}
              onPress={() => {
                searchData();
              }}>
              <Text style={{fontSize: 10, color: '#fff', textAlign: 'center'}}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          marginTop: 12,
          marginLeft: 20,
          marginRight: 20,
          borderColor: '#E2E2E2',
        }}></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {product.map((item, index) => (
          <View style={styles.product}>
            <View style={styles.singleProduct}>
              <Image
                resizeMode="contain"
                source={{
                  uri:
                    Constants.imageUrl + 'category-image/' + item.product_image,
                }}
                style={styles.productImage}
              />
              <Text style={{color: '#5B5B5B', fontSize: 10, marginTop: 4}}>
                Posted on : {moment(item.created_at, 'HH:mm').format('DD-MM-Y')}
              </Text>
            </View>
            <View style={styles.productInformation}>
              <View style={styles.productInformation2}>
                <ReadMore
                  numberOfLines={2}
                  renderTruncatedFooter={handlePress => {
                    return;
                  }}
                  renderRevealedFooter={handlePress => {
                    return;
                  }}>
                  <Text style={styles.productHeading}>{item.product_name}</Text>
                </ReadMore>
              </View>
              <Text style={styles.productPrice}>${item.product_price}</Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ProductViewDetail', {
                      itemId: item.product_name,
                    });
                  }}>
                  <Text style={styles.productButton}>Shop Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    addFav(item.id);
                  }}>
                  {item.is_favorite === 'null' ||
                  item.is_favorite == null ||
                  item.is_favorite == 'null' ? (
                    <FontAwesome name="heart" style={styles.heart} />
                  ) : (
                    <FontAwesome name="heart" style={styles.heartone} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={{height: 220}}></View>
      </ScrollView>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  product: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 20,
    backgroundColor: '#fff',
    shadowColor: '#b5b3b3',
  },
  inputLarge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,

    borderColor: '#9e9e9eb8',
    borderWidth: 1,
    width: 150,
    height: 30,
    padding: 0,
    paddingLeft: 5,
    color: 'gray',
    fontSize: 13,
  },
  inputHeading: {
    fontSize: 10,
    marginLeft: 2,
  },
  productImage: {
    height: 100,
    width: 130,
  },
  heart: {
    borderWidth: 2,
    borderColor: '#ffc000',
    height: 30,
    width: 30,
    marginLeft: 8,
    marginTop: 3,
    fontSize: 15,
    borderRadius: 50,
    paddingTop: 8,
    paddingLeft: 8,
    backgroundColor: '#ffc000',
    color: '#fff',
  },
  heartone: {
    borderWidth: 2,
    borderColor: '#000',
    height: 30,
    width: 30,
    marginLeft: 8,
    marginTop: 3,
    fontSize: 15,
    borderRadius: 50,
    paddingTop: 8,
    paddingLeft: 8,
    backgroundColor: '#000',
    color: '#ffc000',
  },
  productHeading: {
    fontSize: 13,
    paddingRight: 120,
  },
  productPrice: {
    fontSize: 14,
    color: '#81B153',
    marginTop: 2,
  },
  productButton: {
    fontSize: 12,
    color: '#000',
    borderWidth: 2,
    borderColor: '#81B153',
    paddingRight: 23,
    paddingLeft: 23,
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 5,
    borderRadius: 30,
  },
  productInformation: {
    paddingLeft: 10,
    paddingRight: 120,
  },
  productInformation2: {
    height: 35,
  },
  mainContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  searchIcon: {
    backgroundColor: '#FFC000',
    height: 35,
    width: 35,
    fontSize: 25,
    borderRadius: 30,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 7,
  },
  searchInput: {
    borderWidth: 1,
    width: '89%',
    padding: 3,
    paddingLeft: 10,
    backgroundColor: '#f7f8f9',
    borderRadius: 30,
    borderColor: '#F0F0F0',
    elevation: 0,
  },
  topIcon: {
    marginRight: 10,
    fontSize: 30,
    color: '#9BCA6E',
    marginTop: -4,
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
  secondContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingRight: 9,
  },
  arrowHeading: {
    color: '#fff',
    fontSize: 16,
    marginTop: 9,
    marginLeft: 9,
  },
});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from '../../Component/Spinner';
import {GetApi} from '../../Helpers/Service';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actions-sheet';
import moment from 'moment';
const actionSheetRef = createRef();
import ReadMore from 'react-native-read-more-text';

const HomeNew = props => {
  const navigation = useNavigation();
  const [category, setCategory] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [shopItem, setShopItem] = useState([]);
  const [usedItem, setUsedItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getHomeDetail();
    });
    return () => {
      willFocusSubscription;
    };
  }, []);

  const getHomeDetail = () => {
    // setLoading(true);
    GetApi('home-page-data').then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          setCategory(res.data.categories);
          setLostFound(res.data.allItems);
          setShopItem(res.data.productList);
          setUsedItem(res.data.used_list_list);
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const postItem = async type => {
    const user = await AsyncStorage.getItem('userDetail');
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
    <View>
      <Spinner color={'#ffc000'} visible={loading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{backgroundColor: '#fff'}}>
          <Image
            style={{width: '100%', height: 150}}
            resizeMode="cover"
            source={require('../../assets/img/banner-new.png')}
          />
          <View style={styles.searchContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 13,
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.lostBtn1}>Lost & Found</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('KanpidShop')}>
                <Text style={styles.lostBtn1}>Kanpid Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('UsedItemMain')}>
                <Text style={styles.lostBtn1}>Used Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                postItem(1);
              }}>
              <Text style={styles.textOne}>
                <AntDesign
                  name="cloudupload"
                  style={{color: '#DD1C1C', fontSize: 15}}
                />{' '}
                UPLOAD LOST ITEM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                postItem(2);
              }}>
              <Text style={styles.textTwo}>
                <AntDesign
                  name="cloudupload"
                  style={{color: '#45b887', fontSize: 15}}
                />{' '}
                UPLOAD FOUND ITEM
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 20,
              backgroundColor: '#F9F3F3',
              paddingTop: 10,
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 15,
                marginLeft: 20,
                marginTop: 10,
              }}>
              Did you lost or found?{' '}
              <Text style={{color: '#45b887', marginLeft: 5}}>
                look into by category
              </Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {category.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    props.navigation.navigate('SerarchResult', {
                      type: `search_request?cat_id=${item.id}`,
                    });
                  }}>
                  <View
                    style={{
                      marginTop: 20,
                      marginRight: index == category.length - 1 ? 20 : 0,
                      marginLeft: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      elevation: 3,
                      marginBottom: 5,
                      borderRadius: 15,
                    }}>
                    <View>
                      <Image
                        style={{height: 50, width: 36, margin: 5}}
                        resizeMode="contain"
                        source={{
                          uri:
                            Constants.imageUrl + 'category-image/' + item.image,
                        }}></Image>
                    </View>
                    <View>
                      <Text style={styles.headingOne}>{item.name}</Text>
                      <View style={{flexDirection: 'row', marginTop: 1}}>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('SerarchResult', {
                              type: `search_request?cat_id=${item.id}&item_type=1`,
                            });
                          }}>
                          <Text style={{color: '#DD1C1C', fontSize: 12}}>
                            {item.lost_item_count} Listed
                          </Text>
                        </TouchableOpacity>

                        <Text style={{color: '#000'}}> | </Text>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('SerarchResult', {
                              type: `search_request?cat_id=${item.id}&item_type=2`,
                            });
                          }}>
                          <Text style={{color: '#45b887', fontSize: 12}}>
                            {item.found_item_count} Listed
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <View
              style={{
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginTop: 0,
                }}>
                <Text style={styles.lostHeading}>Lost & Found items</Text>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('SerarchResult', {
                      type: `search_request?item_type=1`,
                    });
                  }}>
                  <Text style={styles.viewHeading}>
                    See all{' '}
                    <FontAwesome name="angle-right" style={{fontSize: 20}} />
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {lostFound.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('ProductView', {
                          itemId: item.item_slug,
                        });
                      }}
                      key={index}
                      style={{
                        width: 230,
                        marginTop: 20,
                        marginHorizontal: 10,
                      }}>
                      <Image
                        resizeMode="cover"
                        source={{
                          uri: Constants.imageUrl + 'images/' + item.image,
                        }}
                        style={{
                          width: '100%',
                          height: 150,
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                        }}
                      />
                      <View
                        style={{
                          padding: 10,
                          elevation: 4,
                          backgroundColor: '#fff',
                          borderBottomLeftRadius: 30,
                          borderBottomRightRadius: 30,
                          marginBottom: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            marginTop: 3,
                          }}>
                          {item.item_name.slice(0, 17).concat('....')}
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            marginTop: 4,
                            fontWeight: 'bold',
                          }}>
                          {item.colour}
                        </Text>
                        <Text style={{marginVertical: 10}}>
                          {moment(item.date).format('DD-MM-Y')}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('ProductView', {
                              itemId: item.item_slug,
                            });
                          }}
                          style={{
                            backgroundColor: '#81b153',
                            padding: 10,
                            borderRadius: 30,
                          }}>
                          <Text style={{color: '#fff', textAlign: 'center'}}>
                            View Item
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#81b153',
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginTop: 0,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#fff',
                  }}>
                  Kanpid Shop
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Shop');
                  }}>
                  <Text style={styles.viewHeading1}>
                    View all{' '}
                    <FontAwesome name="angle-right" style={{fontSize: 20}} />
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 10}}>
                {shopItem.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      padding: 10,
                      backgroundColor: '#fff',
                      marginHorizontal: 10,
                      borderRadius: 10,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('ProductViewDetail', {
                          itemId: item.product_name,
                        });
                      }}
                      key={item.id}
                      style={{minWidth: 100, marginRight: 10}}>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri:
                            Constants.imageUrl +
                            'category-image/' +
                            item.product_image,
                        }}
                        style={{
                          width: '100%',
                          height: 150,
                          backgroundColor: '#fff',
                        }}
                      />
                    </TouchableOpacity>

                    <View style={{maxWidth: 200, paddingRight: 10}}>
                      <ReadMore
                        numberOfLines={2}
                        renderTruncatedFooter={handlePress => {
                          return;
                        }}
                        renderRevealedFooter={handlePress => {
                          return;
                        }}>
                        <Text>{item.product_name}</Text>
                      </ReadMore>
                      <Text style={{marginVertical: 10, flexWrap: 'wrap'}}>
                        ${item.product_price}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate('ProductViewDetail', {
                            itemId: item.product_name,
                          });
                        }}
                        key={item.id}>
                        <Text
                          style={{
                            fontSize: 11,
                            borderWidth: 2,
                            paddingTop: 9,
                            paddingBottom: 6,
                            paddingRight: 13,
                            paddingLeft: 13,
                            borderRadius: 30,
                            borderColor: '#81b153',
                            textAlign: 'center',
                            marginBottom: 10,
                          }}>
                          Shop Now
                        </Text>
                      </TouchableOpacity>

                      <Text style={{fontWeight: 'bold', fontSize: 12}}>
                        Posted on : {moment(item.created_at).format('DD-MM-Y')}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginTop: 0,
                }}>
                <Text style={styles.lostHeading2}>Free recommendations</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Shop');
                  }}>
                  <Text style={styles.viewHeading2}>
                    View all{' '}
                    <FontAwesome name="angle-right" style={{fontSize: 20}} />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.flatOne}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginTop: 10}}>
                  {usedItem.map((item, index) => (
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#fff',
                        marginHorizontal: 10,
                        borderRadius: 10,
                      }}
                      key={index}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('CategoryItem', {
                            itemName: item.product_name,
                          });
                        }}
                        style={{
                          borderWidth: 1,
                          borderColor: '#D3D3D3',
                          borderBottomWidth: 0,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                        }}>
                        <Image
                          resizeMode="contain"
                          source={{
                            uri:
                              Constants.imageUrl +
                              'category-image/' +
                              item.product_image,
                          }}
                          style={{
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            width: '100%',
                            height: 150,
                            backgroundColor: '#fff',
                          }}
                        />
                      </TouchableOpacity>
                      <View style={styles.flatSecondContainer}>
                        <ReadMore
                          numberOfLines={1}
                          renderTruncatedFooter={handlePress => {
                            return;
                          }}
                          renderRevealedFooter={handlePress => {
                            return;
                          }}>
                          <Text style={styles.greenHeading}>
                            {item.product_name}
                          </Text>
                        </ReadMore>
                        <View style={styles.priceContainer}>
                          <Text style={styles.headingPrice}>
                            ${item.product_price}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('CategoryItem', {
                                itemName: item.product_name,
                              });
                            }}>
                            <Text style={styles.btnPrice1}>Shop Now</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.proSecond}>
                          Posted on :{' '}
                          {moment(item.created_at).format('DD-MM-Y')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
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
    </View>
  );
};

export default HomeNew;

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItem: 'center',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  bellIcon: {
    color: '#9AC96D',
    fontSize: 35,
    marginTop: 11,
  },
  logoImage: {
    marginRight: 150,
  },
  menuIcon: {
    color: '#9AC96D',
    fontSize: 30,
    marginTop: 3,
  },
  topContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchInput: {
    borderWidth: 1,
    width: '85%',
    padding: 3,
    paddingLeft: 10,
    borderColor: '#F0F0F0',
    borderRadius: 30,
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
  lostBtn1: {
    fontSize: 11,
    borderColor: '#F0F0F0',
    borderWidth: 2,
    padding: 8,
    paddingBottom: 5,
    borderRadius: 5,
    margin: 3,
  },
  lostBtn: {
    fontSize: 11,
    borderColor: '#F0F0F0',
    borderWidth: 1,
    padding: 8,
    paddingBottom: 5,
    borderRadius: 5,
    paddingTop: 5,
    backgroundColor: '#FFC000',
    margin: 3,
  },
  searchContainer: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    marginLeft: 30,
    marginRight: 30,
    height: 60,
    elevation: 15,
    borderRadius: 10,
    marginTop: -35,
  },
  headingOne: {
    fontSize: 18,
    marginTop: 10,
    color: '#000',
  },
  textTwo: {
    backgroundColor: '#CFE9D9',
    padding: 10,
    elevation: 15,
    color: '#45b887',
    fontSize: 11,
    borderRadius: 6,
  },
  textOne: {
    backgroundColor: '#E9CFCF',
    padding: 10,
    elevation: 15,
    color: '#DD1C1C',
    fontSize: 12,
    borderRadius: 6,
  },
  categoryContainer: {
    marginTop: 20,
    paddingLeft: 20,
    backgroundColor: '#F9F3F3',
    paddingTop: 10,
    paddingBottom: 20,
  },
  categoryHeading: {
    fontSize: 19,
    marginTop: 10,
    paddingRight: 30,
  },
  flatContainer: {
    marginTop: 20,
    marginRight: 20,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 3,
    marginBottom: 5,
    borderRadius: 4,
  },
  imgStyle: {
    width: 60,
    height: 50,
    borderWidth: 1,
    resizeMode: 'contain',
    margin: 8,
    borderRadius: 10,
  },
  bannerImage: {
    width: '100%',
    height: 130,
  },

  headingPrice: {
    fontSize: 16,
  },

  btnPrice: {
    fontSize: 11,
    borderWidth: 2,
    paddingTop: 9,
    paddingBottom: 6,
    paddingRight: 13,
    paddingLeft: 13,
    borderRadius: 30,
    borderColor: '#81b153',
  },

  btnPrice1: {
    fontSize: 11,
    borderWidth: 2,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 13,
    paddingLeft: 13,
    borderRadius: 30,
    borderColor: '#5eb38b',
    backgroundColor: '#5eb38b',
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  greenHeading: {
    fontSize: 17,
  },
  mainContainer: {
    padding: 20,
    paddingRight: 0,
    marginTop: 0,
  },
  productOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    marginTop: 15,
  },
  productOneFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    marginTop: 0,
  },
  productOne1: {
    padding: 20,
    backgroundColor: '#81b153',
    paddingRight: 0,
    paddingTop: 6,
  },
  productOne2: {
    padding: 20,
    backgroundColor: '#fff',
    paddingRight: 0,
    paddingTop: 6,
  },
  lostHeading: {
    fontSize: 18,
    color: '#103524',
  },
  viewHeading: {
    fontSize: 18,
    color: '#103524',
  },
  lostHeading1: {
    fontSize: 18,
    color: '#fff',
  },
  viewHeading1: {
    fontSize: 18,
    color: '#fff',
  },
  lostHeading2: {
    fontSize: 18,
    color: '#6cbb96',
  },
  viewHeading2: {
    fontSize: 18,
    color: '#000',
  },
  flatMainContainer: {
    padding: 14,
    // borderWidth:1,
    paddingLeft: 0,
  },
  flatImg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
  },
  firstHeading: {
    fontSize: 15,
    marginTop: 3,
  },
  secondHeading: {
    color: '#767c83',
    marginTop: 4,
  },
  thirdHeading: {
    color: '#767c83',
    marginTop: 4,
  },
  timeHeading: {
    color: '#767c83',
  },
  flatSecondContainer: {
    padding: 12,
    paddingTop: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#fff',
    width: 201,
  },
  proSecond: {
    color: '#767c83',
    fontSize: 10,
  },
  proLast: {
    fontSize: 13,
    textDecorationLine: 'underline',
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

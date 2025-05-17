import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, createRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actions-sheet';
import Spinner from '../../Component/Spinner';
import ReadMore from 'react-native-read-more-text';
import Constants from '../../Helpers/constant';
import {GetApi} from '../../Helpers/Service';

const actionSheetRef = createRef();
const actionSheetRefPost = createRef();

import {useNavigation} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

const {width} = Dimensions.get('window');

const UsedItemMain = () => {
  const navigation = useNavigation();
  const [freshRecommandation, setFreshRecommandation] = useState([]);
  const [oldItem, setOldItem] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const [search, setSearch] = useState('');

  const getOldItem = async () => {
    GetApi('used-item/home-page').then(
      async res => {
        if (res.status == 200) {
          setOldItem(res.data.category_data_list);
          setMasterData(res.data.category_data_list);
          setFreshRecommandation(res.data.get_all_item);
          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  useEffect(() => {
    getOldItem();
  }, []);

  const images = [
    'https://assets.mspimages.in/wp-content/uploads/2021/10/Flipkart-Big-billion-days-2021-featured-image-1.jpeg',
    'https://img.freepik.com/premium-vector/special-offer-sale-discount-banner_180786-46.jpg?w=2000',

    'https://cdn.eyemyeye.com/mobile/images/offers/Special_Offers_Banner_Mobile.jpg',
  ];

  const searchFilter = text => {
    if (text) {
      const newData = masterData.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setOldItem(newData);
      setSearch(text);
    } else {
      setOldItem(masterData);
      setSearch(text);
    }
  };
  const postItem = async () => {
    const user = await AsyncStorage.getItem('userDetail');

    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      navigation.navigate('UploadUsedItem');
    }
  };

  return (
    <View>
      <Spinner color={'#ffc000'} visible={isLoaded} />

      <ScrollView
        style={{backgroundColor: '#f5f5f5', height: '100%'}}
        showsVerticalScrollIndicator={false}>
        <GestureHandlerRootView>
          <Carousel
            loop
            width={width}
            height={width / 2.5}
            modeConfig={{
              parallaxScrollingScale: 0.8,
              parallaxScrollingOffset: 90,
            }}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={2000}
            renderItem={({item}) => {
              return (
                <View style={{padding: 15}}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                    source={{uri: item}}
                  />
                </View>
              );
            }}
          />
        </GestureHandlerRootView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <TextInput
            placeholder="Find Cars, Mobile Phones and more.."
            style={styles.searchInput}
            value={search}
            onChangeText={text => searchFilter(text)}
          />
        </View>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              paddingTop: 5,
              paddingBottom: 5,
            }}>
            <Text style={{fontSize: 13, marginTop: 6}}>
              {' '}
              Search By Category
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#ffc000',
                padding: 8,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 40,
              }}
              onPress={() => {
                postItem();
              }}>
              <Text style={{fontSize: 11, color: '#000'}}>
                {' '}
                <AntDesign name="pluscircle" /> Post Your Add
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 0}}>
            <FlatList
              style={styles.flatlistView}
              numColumns={2}
              data={oldItem}
              renderItem={({item}) => {
                return (
                  <View style={styles.firstView}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.total_product_count === 0) {
                          actionSheetRefPost.current?.setModalVisible();
                        } else {
                          navigation.navigate('UsedItemCategory', {
                            itemCategoryName: item.name,
                          });
                        }
                      }}>
                      <View>
                        <Image
                          resizeMode="contain"
                          source={{
                            uri:
                              Constants.imageUrl +
                              'category-image/' +
                              item.image,
                          }}
                          style={styles.categoryImg}
                        />
                      </View>
                      <View>
                        <Text style={styles.heading}>{item.name}</Text>
                        <Text style={styles.heading1}>
                          Total Products- {item.total_product_count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}></FlatList>
          </View>
        </View>
        <View>
          <Text style={{fontSize: 15, marginLeft: 20}}>
            Fresh Recommandation
          </Text>

          <View>
            <FlatList
              horizontal
              data={freshRecommandation}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}, index) => {
                return (
                  <View
                    style={{
                      marginLeft: 20,
                      marginRight:
                        index === freshRecommandation.length - 1 ? 0 : 10,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CategoryItem', {
                          itemName: item.product_name,
                        })
                      }>
                      <View
                        style={{
                          // margin: 10,
                          marginVertical: 20,

                          paddingTop: 15,
                          padding: 10,
                          paddingBottom: 20,
                          backgroundColor: '#fff',
                          marginLeft: 0,
                          elevation: 4,
                          borderRadius: 7,
                        }}>
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

                        <View
                          style={{
                            marginTop: 10,
                            fontSize: 12,
                            width: 140,
                            marginLeft: 5,
                          }}>
                          <ReadMore
                            numberOfLines={1}
                            renderTruncatedFooter={handlePress => {
                              return;
                            }}
                            renderRevealedFooter={handlePress => {
                              return;
                            }}>
                            <Text>{item.product_name}</Text>
                          </ReadMore>
                        </View>

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
                    </TouchableOpacity>
                  </View>
                );
              }}></FlatList>
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
                navigation.navigate('Signin');
                actionSheetRef.current?.hide();
              }}>
              <Text style={styles.actionBtn}>Login</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
        <ActionSheet
          ref={actionSheetRefPost}
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

            <Text
              style={{
                color: '#4AAB7E',
                fontSize: 16,
                textTransform: 'capitalize',
              }}>
              No product available in this category
            </Text>
          </View>
        </ActionSheet>
      </ScrollView>
    </View>
  );
};

export default UsedItemMain;

const styles = StyleSheet.create({
  heading: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },

  flatlistView: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    width: '100%',
    padding: 3,
    paddingLeft: 10,
    backgroundColor: '#f7f8f9',
    borderRadius: 30,
    borderColor: '#ffc000',
    elevation: 0,
  },
  relatedView: {
    // margin: 20,
    marginRight: 0,
  },
  reImg: {
    width: 145,
    height: 150,
    borderRadius: 7,
  },
  heading1: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },
  firstView: {
    flex: 1,
    margin: 5,
    height: 160,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9bca6e',
    borderRadius: 20,
  },

  cateHeading: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },

  categoryImg: {
    width: 80,
    height: 80,
    elevation: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
  },

  mainContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
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
    height: 34,
    width: 34,
    fontSize: 20,
    borderRadius: 30,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 7,
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

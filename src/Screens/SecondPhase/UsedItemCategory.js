import {
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ReadMore from 'react-native-read-more-text';
import {Dropdown} from 'react-native-element-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Post, GetApi} from '../../Helpers/Service';
import SharePost from '../../Component/SharePost';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import Toaster from '../../Component/Toaster';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const UsedItemCategory = ({route}) => {
  const navigation = useNavigation();

  const [oldCategoryProduct, setOldCategoryProduct] = useState([]);
  const [subMainItem, setSubMainItem] = useState([]);
  const [fourProduct, setFourProduct] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [selCatName, setSelCatName] = useState('');
  const [selSubCatName, setSelSubCatName] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [sproduct, setSproduct] = useState('');
  const [user_id, setUserId] = useState('0');

  const getOldCategoryProduct = async () => {
    try {
      const user = await AsyncStorage.getItem('userDetail');
      if (user === null) {
        setUserId(0);
      } else {
        setUserId(JSON.parse(user).user_id);
      }

      GetApi(
        `used-item/search-page?category=${name}&current_user_id=${user_id}`,
      ).then(
        async res => {
          if (res.status == 200) {
            setOldCategoryProduct(res.data.all_item);
            setMasterData(res.data.all_item);
            setCategory(res.data.all_category);
            setSubCategory(res.data.all_sub_category);
            setSubMainItem(res.data.sub_main_item);
            setFourProduct(res.data.main_item);
            setSelCatName(name);
            setIsLoaded(false);
          }
        },
        err => {
          console.log(err);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOldCategoryProduct();
  }, []);
  const name = route.params.itemCategoryName;

  const searchData = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      setUserId(0);
    } else {
      setUserId(JSON.parse(user).user_id);
    }
    GetApi(
      `used-item/search-page?category=${selCatName}&sub_category=${selSubCatName}&min_price=${minPrice}&max_price=${maxPrice}&current_user_id=${user_id}`,
    ).then(
      async res => {
        if (res.status == 200) {
          setOldCategoryProduct(res.data.all_item);
          setMasterData(res.data.all_item);
          setCategory(res.data.all_category);
          setSubCategory(res.data.all_sub_category);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const getSubCateory = async id => {
    GetApi(`used-item/get-all-sub-category/${id}`).then(
      async res => {
        if (res.status == 200) {
          setSubCategory(res.data.sub_category);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const submitData = async ({ItemId}) => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user == null) {
      actionSheetRef.current?.setModalVisible();
      return;
    }
    const userId = JSON.parse(user).user_id;
    const data = {
      user_id: userId,
      product_id: ItemId,
    };
    setIsLoaded(true);
    Post(`used-item/add-favourite`, data).then(
      async res => {
        setIsLoaded(false);
        if (res.status == 200) {
          Toaster(res?.data?.data);
          getOldCategoryProduct();
          // console.log('Insert');
        } else {
          console.log('Delete');
        }
      },
      err => {
        setIsLoaded(false);
        console.log(err);
      },
    );
  };

  const searchProduct = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    if (user === null) {
      setUserId(0);
    } else {
      setUserId(JSON.parse(user).user_id);
    }
    GetApi(
      `used-item/search-page?product_name=${sproduct}&current_user_id=${user_id}`,
    ).then(
      async res => {
        if (res.status == 200) {
          setOldCategoryProduct(res.data.all_item);
          setMasterData(res.data.all_item);
          setCategory(res.data.all_category);
          setSubCategory(res.data.all_sub_category);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  return (
    <View style={{marginBottom: 20}}>
      <Spinner color={'#ffc000'} visible={isLoaded} />

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
          value={sproduct}
          onChangeText={actualData => setSproduct(actualData)}
        />
        <AntDesign
          name="search1"
          style={styles.searchIcon}
          onPress={() => {
            searchProduct();
          }}
        />
      </View>
      <View style={{marginLeft: 20, marginRight: 20, paddingBottom: 10}}>
        <Text style={{fontSize: 13, marginLeft: 2}}>Filter By Category:</Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '50%', padding: 2}}>
            <Dropdown
              style={[
                styles.dropdown,
                {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              placeholder="Select Category"
              data={category}
              value={selCatName}
              maxHeight={300}
              labelField="name"
              valueField="name"
              onChange={item => {
                setSelCatName(item.name);
                getSubCateory(item.id);
              }}
            />
          </View>
          <View style={{width: '50%', padding: 2}}>
            <Dropdown
              style={[
                styles.dropdown,
                {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              placeholder="Select Sub Category"
              data={subCategory}
              maxHeight={300}
              labelField="name"
              valueField="name"
              onChange={item => {
                setSelSubCatName(item.name);
              }}
              value={selSubCatName}
            />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{width: '39%', padding: 2}}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputLarge}
              value={minPrice}
              onChangeText={actualData => setMinPrice(actualData)}
            />
            <Text style={styles.inputHeading}>Min Price:</Text>
          </View>
          <View style={{width: '39%', padding: 2}}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputLarge}
              value={maxPrice}
              onChangeText={actualData => setMaxPrice(actualData)}
            />
            <Text style={styles.inputHeading}>Max Price:</Text>
          </View>
          <View style={{width: '20%', padding: 2}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4aab7e',
                padding: 8,
                borderRadius: 4,
                width: 60,
              }}
              onPress={() => {
                searchData();
              }}>
              <Text style={{fontSize: 10, color: '#fff', textAlign: 'center'}}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{margin: 20, marginBottom: 5, marginTop: 5}}>
          <Text style={{fontSize: 15, marginLeft: 2}}>Products</Text>
          <FlatList
            horizontal
            data={subMainItem}
            renderItem={({item}) => {
              return (
                <View style={styles.submainitem}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CategoryItem', {
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
                      style={styles.imageOne}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#000',
                      marginLeft: 0,
                      fontSize: 13,
                      textTransform: 'capitalize',
                      marginTop: 10,
                    }}>
                    {item.product_name}
                  </Text>
                  <View
                    style={{
                      width: 130,
                    }}>
                    <ReadMore
                      numberOfLines={1}
                      renderTruncatedFooter={handlePress => {
                        return;
                      }}
                      renderRevealedFooter={handlePress => {
                        return;
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          marginLeft: 3,
                          fontSize: 10,
                          textTransform: 'capitalize',
                          marginTop: 10,
                        }}>
                        {item.product_description.replace(/<(?:.|\n)*?>/gm, '')}
                      </Text>
                    </ReadMore>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <View>
                      <Text style={{color: '#fff', fontSize: 12}}>
                        Rs{item.product_price}
                      </Text>
                      <Text style={{fontSize: 10, color: '#fff'}}>
                        43 days ago
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CategoryItem', {
                            itemName: item.product_name,
                          })
                        }>
                        <Text
                          style={{
                            fontSize: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                            marginTop: 9,
                            color: '#fff',
                          }}>
                          Buy Now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      SharePost({
                        post_id: item.item_slug,
                        description: item.product_description,
                        title: item.product_name,
                        image:
                          'https://www.kanpid.lk/assets/admin_assets/admin_assets/category-image/' +
                          item.product_image,
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
                </View>
              );
            }}
          />
        </View>
        <View
          style={{margin: 20, marginBottom: 5, marginRight: 0, marginTop: 0}}>
          <Text style={{fontSize: 15, marginLeft: 2}}>
            (Showing 1 – 4 products of 4 products)
          </Text>
          <FlatList
            horizontal
            data={fourProduct}
            renderItem={({item}) => {
              return (
                <View style={styles.submainitem1}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CategoryItem', {
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
                      style={styles.imageOne}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 130,
                      marginTop: 10,
                    }}>
                    <ReadMore
                      numberOfLines={1}
                      renderTruncatedFooter={handlePress => {
                        return;
                      }}
                      renderRevealedFooter={handlePress => {
                        return;
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 13,
                          textTransform: 'capitalize',
                          marginTop: 10,
                          width: 130,
                        }}>
                        {item.product_name}
                      </Text>
                    </ReadMore>
                    <ReadMore
                      numberOfLines={2}
                      renderTruncatedFooter={handlePress => {
                        return;
                      }}
                      renderRevealedFooter={handlePress => {
                        return;
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          marginLeft: 3,
                          fontSize: 10,
                          textTransform: 'capitalize',
                          marginTop: 10,
                        }}>
                        {item.product_description.replace(/<(?:.|\n)*?>/gm, '')}
                      </Text>
                    </ReadMore>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <View>
                      <Text style={{color: '#fff', fontSize: 12}}>
                        Rs{item.product_price}
                      </Text>
                      <Text style={{fontSize: 10, color: '#fff'}}>
                        43 days ago
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CategoryItem', {
                            itemName: item.product_name,
                          })
                        }
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          paddingTop: 4,
                          paddingBottom: 6,
                          borderRadius: 30,
                          marginTop: 6,
                        }}>
                        <Text style={{fontSize: 10, color: '#000'}}>
                          Buy Now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      SharePost({
                        post_id: item.item_slug,
                        description: item.product_description,
                        title: item.product_name,
                        image:
                          'https://www.kanpid.lk/assets/admin_assets/admin_assets/category-image/' +
                          item.product_image,
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
                </View>
              );
            }}
          />
        </View>

        <View style={{padding: 2, marginBottom: 180, margin: 5}}>
          <FlatList
            numColumns={2}
            data={oldCategoryProduct}
            renderItem={({item, index}) => {
              return (
                <View style={{width: '50%', padding: 2}}>
                  <View style={styles.imageView}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CategoryItem', {
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
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        width: 130,
                      }}>
                      <ReadMore
                        numberOfLines={1}
                        renderTruncatedFooter={handlePress => {
                          return;
                        }}
                        renderRevealedFooter={handlePress => {
                          return;
                        }}>
                        <Text style={styles.productName}>
                          {item.product_name}
                        </Text>
                      </ReadMore>
                    </View>
                    <View
                      style={{
                        width: 130,
                      }}>
                      <ReadMore
                        numberOfLines={2}
                        renderTruncatedFooter={handlePress => {
                          return;
                        }}
                        renderRevealedFooter={handlePress => {
                          return;
                        }}>
                        <Text style={styles.productpara}>
                          {item.product_description.replace(
                            /<(?:.|\n)*?>/gm,
                            '',
                          )}
                        </Text>
                      </ReadMore>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        submitData({
                          ItemId: item.id,
                        });
                      }}
                      style={{marginTop: 10}}>
                      {item.is_favorite === 'null' ||
                      item.is_favorite == null ||
                      item.is_favorite == 'null' ? (
                        <EvilIcons
                          name="heart"
                          style={{
                            backgroundColor: '#FFC000',

                            height: 25,
                            width: 25,
                            fontSize: 20,
                            borderRadius: 30,
                            color: '#fff',

                            textAlign: 'center',
                            paddingTop: 5,
                            position: 'absolute',
                            bottom: 142,
                            right: 3,
                          }}
                        />
                      ) : (
                        <EvilIcons
                          name="heart"
                          style={{
                            backgroundColor: '#000',

                            height: 25,
                            width: 25,
                            fontSize: 20,
                            borderRadius: 30,
                            color: '#FFC000',

                            textAlign: 'center',
                            paddingTop: 5,
                            position: 'absolute',
                            bottom: 142,
                            right: 3,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                    <View style={styles.btnView}>
                      <View>
                        <Text style={styles.productPrice}>
                          Rs{item.product_price}
                        </Text>
                        <Text style={styles.productpara}>237 days ago</Text>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={styles.productbtn}
                          onPress={() =>
                            navigation.navigate('CategoryItem', {
                              itemName: item.product_name,
                            })
                          }>
                          <Text style={styles.productbtn1}>Buy Now</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.iconView, {marginLeft: 5}]}
                      onPress={() => {
                        SharePost({
                          post_id: item.product_name,
                          description: item.product_description,
                          title: item.product_name,
                          screen: 'CategoryItem',
                          image:
                            'https://www.kanpid.lk/assets/admin_assets/admin_assets/category-image/' +
                            item.product_image,
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
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{backgroundColor: '#fff'}}>
        <View
          style={{
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: '#4AAB7E',
              width: 50,
              height: 5,
              borderRadius: 25,
              marginBottom: 30,
            }}></View>

          <Text style={{color: '#4AAB7E', fontSize: 16}}>Please login</Text>
          <TouchableOpacity
            style={{marginTop: 30}}
            onPress={() => {
              props.navigation.navigate('Signin');
              actionSheetRef.current?.hide();
            }}>
            <Text
              style={{
                backgroundColor: '#4AAB7E',
                borderRadius: 25,
                paddingVertical: 5,
                paddingHorizontal: 15,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default UsedItemCategory;

const styles = StyleSheet.create({
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
  iconView: {
    height: 25,
    width: 25,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AAB7E',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  inputLarge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,

    borderColor: '#9e9e9eb8',
    borderWidth: 1,
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
  dropdown: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 10,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
  submainitem: {
    borderWidth: 1,
    borderColor: '#ff5868',
    margin: 10,
    padding: 10,
    marginLeft: 0,
    borderRadius: 4,
    backgroundColor: '#ff5868',
  },
  submainitem1: {
    borderWidth: 1,
    borderColor: '#ff5868',
    margin: 10,
    padding: 10,
    marginLeft: 0,
    borderRadius: 4,
    backgroundColor: '#ff5868',
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
  image: {
    width: 140,
    height: 130,
    borderRadius: 10,
  },
  imageOne: {
    width: 130,
    height: 100,
    borderRadius: 2,
    borderRadius: 4,
  },
  imageView: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f6fa',
    width: '100%',
  },
  productName: {
    fontSize: 12,
    width: 135,
    marginLeft: 4,
    marginTop: 5,
  },
  productpara: {
    width: 130,
    marginLeft: 4,
    fontSize: 9,
    color: '#ababab',
  },
  heartIcon: {
    backgroundColor: '#FFC000',
    height: 25,
    width: 25,
    fontSize: 20,
    borderRadius: 30,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 5,
    position: 'absolute',
    bottom: 142,
    right: 3,
  },
  productPrice: {
    marginLeft: 4,
    fontSize: 13,
    color: '#9ac96b',
  },
  productbtn: {
    backgroundColor: '#9ac96b',
    width: 70,
    paddingTop: 5,
    paddingBottom: 8,
    borderRadius: 15,
    marginLeft: -60,
    marginTop: 5,
  },
  productbtn1: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
  },
  btnView: {
    display: 'flex',
    flexDirection: 'row',
    width: 120,
    marginTop: 13,
  },
});

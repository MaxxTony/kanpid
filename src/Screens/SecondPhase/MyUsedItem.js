import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import {useNavigation} from '@react-navigation/native';
import ReadMore from 'react-native-read-more-text';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';

const MyUsedItem = () => {
  const navigation = useNavigation();

  const [itemList, setItemList] = useState();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    getAllUsedItem();
  }, []);

  const getAllUsedItem = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    GetApi(`used-item/my-items?user_id=${userId}`).then(
      async res => {
        if (res.status == 200) {
          console.log(res.data.product);
          setItemList(res.data.product);
          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  const deleteItem = async productDelete => {
    Alert.alert('Delete Used Item', 'Are you sure to delete item ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          GetApi(`used-item/delete-product/${productDelete}`).then(
            async res => {
              if (res.status == 200) {
                getAllUsedItem();
                setIsLoaded(false);
              }
            },
            err => {
              setIsLoaded(false);
              console.log(err);
            },
          ),
      },
    ]);
  };

  return (
    <View style={styles.firstContainer}>
      <Spinner color={'#ffc000'} visible={isLoaded} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 16,
            marginTop: 9,
            color: '#000',
          }}>
          All Used Item
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#ffc000',
            padding: 8,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 48,
          }}
          onPress={() => {
            navigation.navigate('UploadUsedItem');
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Mulish-SemiBold',
            }}>
            Add New <Entypo name="plus" style={{color: '#000', fontSize: 13}} />{' '}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={itemList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.boxContainer}>
              <View style={{width: '35%'}}>
                <Image
                  resizeMode="contain"
                  style={{width: 100, height: 100, borderRadius: 10}}
                  source={{
                    uri:
                      Constants.imageUrl +
                      'category-image/' +
                      item.product_image,
                  }}
                />
              </View>
              <View style={{marginLeft: 10, width: '65%'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginRight: 10,
                  }}>
                  <Text style={{color: '#000'}}>{item.product_name}</Text>
                  {item.status === 0 ? (
                    <Text
                      style={{
                        color: '#fff',
                        padding: 5,
                        backgroundColor: '#103524',
                        alignSelf: 'flex-start',
                        marginVertical: 5,
                        borderRadius: 20,
                        fontSize: 10,
                        paddingHorizontal: 10,
                      }}>
                      Active
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: '#000',
                        padding: 5,
                        backgroundColor: '#E1E1E1',
                        alignSelf: 'flex-start',
                        marginVertical: 5,
                        borderRadius: 20,
                        fontSize: 10,
                        paddingHorizontal: 10,
                      }}>
                      In Active
                    </Text>
                  )}
                </View>

                <ReadMore
                  numberOfLines={4}
                  renderTruncatedFooter={handlePress => {
                    return;
                  }}
                  renderRevealedFooter={handlePress => {
                    return;
                  }}>
                  <Text>
                    {item.product_description.replace(/<(?:.|\n)*?>/gm, '')}
                  </Text>
                </ReadMore>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <View>
                    <Text>Rs{item.product_price}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <TouchableOpacity
                      onPress={() => {
                        var productDelete = item.id;

                        deleteItem(item.id);
                      }}>
                      <MaterialCommunityIcons
                        name="delete"
                        style={{
                          fontSize: 16,
                          color: '#ff0000',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('EditUsedItem', {
                          productId: item.id,
                        });
                      }}>
                      <FontAwesome5
                        name="user-edit"
                        style={{
                          fontSize: 13,
                          color: '#103524',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('UsedItemUploadImage', {
                          productId: item.id,
                        });
                      }}>
                      <MaterialIcons
                        name="perm-media"
                        style={{
                          fontSize: 15,
                          color: '#a5d279',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('PromotedAds', {
                          itemId: item.id,
                        });
                      }}>
                      <EvilIcons
                        name="sc-telegram"
                        style={{
                          fontSize: 20,
                          color: '#17a2b8',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyUsedItem;

const styles = StyleSheet.create({
  firstContainer: {
    padding: 20,
    marginBottom: 30,
  },
  boxContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#9ac96d',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
});

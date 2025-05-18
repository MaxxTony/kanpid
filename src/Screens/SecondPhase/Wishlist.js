import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import ReadMore from 'react-native-read-more-text';
import {useNavigation} from '@react-navigation/native';

const Wishlist = () => {
  const navigation = useNavigation();

  const [list, setList] = useState();

  useEffect(() => {
    getFavouriteList();
  }, []);
  const getFavouriteList = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    console.log(userId);
    GetApi(`used-item-favourite-list?user_id=${userId}`).then(
      async res => {
        if (res.status == 200) {
          setList(res.data.product);
          console.log(res.data.product);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  return (
    <View style={styles.firstContainer}>
      <Text>Favourite List</Text>

      <FlatList
        data={list}
        renderItem={({item, index}) => {
          return (
            <View style={styles.secondContainer}>
              <View>
                <Image
                  resizeMode="contain"
                  style={styles.img}
                  source={{
                    uri:
                      Constants.imageUrl +
                      'category-image/' +
                      item.product_image,
                  }}></Image>
              </View>
              <View style={{marginLeft: 10, width: 190}}>
                <ReadMore
                  numberOfLines={2}
                  renderTruncatedFooter={handlePress => {
                    return;
                  }}
                  renderRevealedFooter={handlePress => {
                    return;
                  }}>
                  <Text style={{fontSize: 14, color: '#000'}}>
                    {item.product_name}
                  </Text>
                </ReadMore>

                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={handlePress => {
                    return;
                  }}
                  renderRevealedFooter={handlePress => {
                    return;
                  }}>
                  <Text style={{fontSize: 11}}>
                    {item.product_description.replace(/<(?:.|\n)*?>/gm, '')}
                  </Text>
                </ReadMore>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{marginTop: 8, color: '#82b153'}}>
                      <Text>Price:</Text>
                      Rs{item.product_price}
                    </Text>
                  </View>

                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#fe0000',
                        padding: 5,
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                        marginTop: 6,
                      }}
                      onPress={() =>
                        navigation.navigate('CategoryItem', {
                          itemName: item.product_name,
                        })
                      }>
                      <Text
                        style={{
                          fontSize: 10,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Buy Now
                      </Text>
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

export default Wishlist;

const styles = StyleSheet.create({
  firstContainer: {
    padding: 20,
  },
  secondContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#82b153',
    padding: 10,
    borderRadius: 5,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

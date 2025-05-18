import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
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

const PromotedItems = () => {
  const navigation = useNavigation();

  const [itemList, setItemList] = useState();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    getAllUsedItem();
  }, []);
  const getAllUsedItem = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    GetApi(`used-item/my-promoted-items?user_id=${userId}`).then(
      async res => {
        if (res.status == 200) {
          setItemList(res.data.my_promoted_items);
          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  return (
    <View style={{padding: 20}}>
      <Text>All Promoted Items</Text>
      <FlatList
        data={itemList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.boxContainer}>
              <View>
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
              <View style={{marginLeft: 10, width: 190}}>
                <Text style={{color: '#000'}}>{item.product_name}</Text>

                <ReadMore
                  numberOfLines={2}
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
                <Text style={{marginTop: 4}}>Rs{item.product_price}</Text>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text style={{fontSize: 9}}>
                      Start Date:
                      <Text style={{color: '#9ac96d'}}>{item.start_date}</Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={{fontSize: 9}}>
                      End Date:
                      <Text style={{color: '#dc3545'}}>{item.end_date}</Text>
                    </Text>
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

export default PromotedItems;

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
  },
});

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Product = () => {
  const navigation = useNavigation();

  const pOne = [
    {
      img: require('../../assets/img/product-2.png'),
      name: 'Product Image',
      category: 'Apple | Black | 2.45pm',
      description: '2336 jack warren Rd',
    },
    {
      img: require('../../assets/img/product-3.png'),
      name: 'Product Image',
      category: 'Apple | Black | 2.45pm',
      description: '2336 jack warren Rd',
    },
    {
      img: require('../../assets/img/product-4.png'),
      name: 'Product Image',
      category: 'Apple | Black | 2.45pm',
      description: '2336 jack warren Rd',
    },
    {
      img: require('../../assets/img/product-5.jpg'),
      name: 'Product Image',
      category: 'Apple | Black | 2.45pm',
      description: '2336 jack warren Rd',
    },
  ];
  return (
    <View>
      <View style={styles.mainContainer}>
        <View style={styles.productOneFirst}>
          <Text style={styles.lostHeading}>Lost & Found items</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shop');
            }}>
            <Text style={styles.viewHeading}>
              See all <FontAwesome name="angle-right" style={{fontSize: 20}} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatOne}>
          <FlatList
            data={pOne}
            horizontal
            renderItem={({item}) => {
              return (
                <View style={styles.flatMainContainer}>
                  <Image source={item.img} style={styles.flatImg} />
                  <View style={styles.flatSecondContainer}>
                    <Text style={styles.firstHeading}>{item.name}</Text>
                    <Text style={styles.secondHeading}>{item.category}</Text>
                    <Text style={styles.thirdHeading}>{item.description}</Text>

                    <View style={styles.productOne}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ProductViewDetail');
                        }}>
                        <Text style={styles.proLast}>View Item</Text>
                      </TouchableOpacity>
                      <Text style={styles.proSecond}>1 Day Ago</Text>
                    </View>
                  </View>
                </View>
              );
            }}></FlatList>
        </View>
      </View>
      {/* second section */}
      <View style={styles.productOne1}>
        <View style={styles.productOne}>
          <Text style={styles.lostHeading1}>Kanpid Shop</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shop');
            }}>
            <Text style={styles.viewHeading1}>
              View all <FontAwesome name="angle-right" style={{fontSize: 20}} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatOne}>
          <FlatList
            data={pOne}
            horizontal
            renderItem={({item}) => {
              return (
                <View style={styles.flatMainContainer}>
                  <Image source={item.img} style={styles.flatImg} />
                  <View style={styles.flatSecondContainer}>
                    <Text style={styles.firstHeading}>
                      Slim Fit Cotton Track Pants
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.headingPrice}>$499</Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ProductViewDetail');
                        }}>
                        <Text style={styles.btnPrice}>Shop Now</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.proSecond}>1 Day Ago</Text>
                  </View>
                </View>
              );
            }}></FlatList>
        </View>
      </View>
      {/* Third section */}
      <View style={styles.productOne2}>
        <View style={styles.productOne}>
          <Text style={styles.lostHeading2}>Free recommendations</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shop');
            }}>
            <Text style={styles.viewHeading2}>
              View all <FontAwesome name="angle-right" style={{fontSize: 20}} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatOne}>
          <FlatList
            data={pOne}
            horizontal
            renderItem={({item}) => {
              return (
                <View style={styles.flatMainContainer}>
                  <Image source={item.img} style={styles.flatImg} />
                  <View style={styles.flatSecondContainer}>
                    <Text style={styles.greenHeading}>
                      Slim Fit Cotton Track Pants
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.headingPrice}>$499</Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ProductViewDetail');
                        }}>
                        <Text style={styles.btnPrice1}>Shop Now</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.proSecond}>1 Day Ago</Text>
                  </View>
                </View>
              );
            }}></FlatList>
        </View>
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
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
  },
  greenHeading: {
    fontSize: 17,
  },
  mainContainer: {
    padding: 30,
    paddingRight: 0,
    paddingLeft: 25,
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
    padding: 25,
    backgroundColor: '#81b153',
    paddingRight: 0,
    paddingTop: 6,
  },
  productOne2: {
    padding: 25,
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
    paddingLeft: 0,
  },
  flatImg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 201,
    height: 150,
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
  flatSecondContainer: {
    padding: 12,
    paddingTop: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderTopWidth: 0,
    height: 135,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#fff',
    width: 201,
  },
  proSecond: {
    color: '#d2d3ce',
    fontSize: 10,
  },
  proLast: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../../Component/Spinner';

import {Post, GetApi} from '../../Helpers/Service';
import {useNavigation} from '@react-navigation/native';
import Toaster from '../../Component/Toaster';
import {CardField, useStripe} from '@stripe/stripe-react-native';

const PromoteAds = ({route}) => {
  const productId = route.params.itemId;

  const navigation = useNavigation();

  const data = [{label: 'LKR', value: 'LKR'}];

  const [promote, setPromote] = useState();
  const [currency, setCurrency] = useState('LKR');
  const [promoteAdsAmount, setPromoteAdsAmount] = useState('');
  const [selectPackage, setSelectPackage] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  useEffect(() => {
    getPromote();
    // initializePaymentSheet();
  }, []);

  const getPromote = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log(user, 'user info for checking promote');
    const userId = JSON.parse(user).user_id;
    GetApi(`used-item/get-promotion/${productId}/${userId}`).then(
      async res => {
        if (res.status == 200) {
          setPromote(res.data.promotion);
          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const submitData = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`${error.code}`, error.message);
    } else {
      const user = await AsyncStorage.getItem('userDetail');
      const userId = JSON.parse(user).user_id;
      const data = {
        promotion_id: selectPackage,
        user_id: userId,
        used_item_id: productId,
      };

      setIsLoaded(true);

      Post(`used-item/post-promotion`, data).then(
        async res => {
          console.log('----sucessful', res);
          if (res.status == 200) {
            console.log('success');
            navigation.navigate('UsedThankYou');
          } else {
            console.log('fail');
            setIsLoaded(false);
            Toaster('Please fill the correct details');
          }
        },
        err => {
          console.log(err);
        },
      );
    }
  };

  const onClickItem = (item, index) => {
    console.log('click 1', item.price);
    initializePaymentSheet(item.price);

    const newArrData = promote.map((e, index) => {
      if (item.id == e.id) {
        return {
          ...e,
          selected: true,
        };
      }
      return {
        ...e,
        selected: false,
      };
    });
    setPromote(newArrData);
  };

  const initializePaymentSheet = async adsAmount => {
    const user = await AsyncStorage.getItem('userDetail');
    const userName = JSON.parse(user).first_name;

    console.log('click 2');
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams(adsAmount);

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: userName,
      },
    });
    if (error) {
      console.log('error aagya h');
    }
  };

  const fetchPaymentSheetParams = async adsAmount => {
    setIsLoaded(true);
    console.log('updated currency', currency);
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    const newAmount = adsAmount *100
    const response = await fetch(
      `https://www.kanpid.lk/api/useditem-promote-payment?user_id=${userId}&currency=${currency}&adsAmount=${newAmount}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    setIsLoaded(false);

    console.log('all responces', response);

    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  return (
    <ScrollView>
      <View style={{padding: 10, marginTop: 0, width: '100%'}}>
        <Spinner color={'#ffc000'} visible={isLoaded} />
        <View style={{paddingLeft: 5, paddingRight: 5, marginBottom: 20}}>
          <Text style={styles.inputName}>Select Currency:</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {borderColor: '#9e9e9eb8', marginTop: 5, color: '#9e9e9eb8'},
            ]}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            placeholder="Select Currency"
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={currency}
            onChange={item => {
              setCurrency(item.value);
            }}
          />
        </View>
        <FlatList
          numColumns={3}
          data={promote}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '33.33%',
                }}>
                <View
                  style={{
                    margin: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: item.selected ? '#82b153' : '#113525',
                      width: '100%',
                      borderRadius: 10,
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}
                    onPress={() => {
                      var Package = item.id;
                      setSelectPackage(Package);
                      onClickItem(item, index);
                    }}>
                    <View style={{width: '100%'}}>
                      <Text style={styles.Text}>{item.title}</Text>
                      <Text style={styles.TextOne}>{item.description}</Text>
                      <Text style={styles.TextTwo}>
                        Rs{item.price}/
                        <Text style={{fontSize: 25}}>{item.validity}</Text>{' '}
                        <Text style={styles.TextThree}>Days</Text>
                      </Text>

                      <Text
                        style={{
                          backgroundColor: '#9ac96d',
                          padding: 7,
                          marginTop: 4,

                          textAlign: 'center',
                          fontSize: 12,
                          color: '#fff',
                        }}>
                        Select Package
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        <View style={{paddingLeft: 5, paddingRight: 5}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#4aab7e',
              marginTop: 10,
              borderRadius: 4,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onPress={() => {
              submitData();
            }}>
            <Text style={{textAlign: 'center', color: '#fff'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PromoteAds;

const styles = StyleSheet.create({
  firstContainer: {
    padding: 15,
  },

  dropdown: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#000',
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 13,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  Text: {
    color: '#fff',
    textAlign: 'center',
  },
  TextOne: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
  },
  TextTwo: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  TextThree: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  TextFour: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 9,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9e9e9eb8',
    height: 45,
    borderBottomWidth: 0,
    marginTop: 5,
    fontSize: 13,
  },
  inputName: {
    marginTop: 8,
    fontSize: 12,
  },
});

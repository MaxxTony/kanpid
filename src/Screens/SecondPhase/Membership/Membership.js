import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import Toaster from '../../../Component/Toaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../../../Component/Spinner';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {Post, GetApi} from '../../../Helpers/Service';
import {useNavigation} from '@react-navigation/native';

const Membership = () => {
  const navigation = useNavigation();
  const data = [{label: 'LKR', value: 'LKR'}];
  const [currency, setCurrency] = useState('LKR');
  const [isLoaded, setIsLoaded] = useState(false);
  const [myMembership, setMyMembership] = useState([]);
  const [myMembershipText, setMyMembershipText] = useState([]);
  const [selectPackage, setSelectPackage] = useState('');
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const getMembership = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    GetApi(`user-membership/${userId}`).then(
      async res => {
        if (res.status == 200) {
          setMyMembership(res.data.membership_data);
          setMyMembershipText(res.data.check_membership);
          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  useEffect(() => {
    getMembership();
    // initializePaymentSheet();
  }, []);

  const submitData = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`${error.code}`, error.message);
    } else {
      const user = await AsyncStorage.getItem('userDetail');
      const userId = JSON.parse(user).user_id;
      const data = {
        membership_id: selectPackage,
        user_id: userId,
      };
      setIsLoaded(true);
      Post(`user-post-membership`, data).then(
        async res => {
          if (res.status == 200) {
            console.log('success');
            navigation.navigate('UsedThankYou');
          } else {
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
    console.log('click item', item.price);
    initializePaymentSheet(item.price);
    const newArrData = myMembership.map((e, index) => {
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
    setMyMembership(newArrData);
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
    console.log('updated currency', currency);
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    const newAmount = adsAmount ;
    const response = await fetch(
      `https://www.kanpid.lk/api/useditem-membership-payment?user_id=${userId}&currency=${currency}&adsAmount=${newAmount}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('all responces', response);

    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  return (
    <View>
      <Spinner color={'#ffc000'} visible={isLoaded} />
      <View style={styles.firstContainer}>
        {(() => {
          if (myMembershipText === 'yes') {
            return (
              <Text
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                  color: '#dc3545',
                }}>
                (You have already taken membership. If you want to extend your
                membership plan .Then please fill the the required filled.)
              </Text>
            );
          } else {
            return (
              <Text
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                  color: '#dc3545',
                }}>
                (Please Choose a Plan)
              </Text>
            );
          }
        })()}

        <View
          style={{
            marginVertical: 7,
          }}>
          <View style={{padding: 2}}>
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
        </View>

        <View style={{padding: 2}}>
          <FlatList
            numColumns={2}
            data={myMembership}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: '50%',
                  }}>
                  <View
                    style={{
                      margin: 5,
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: item.selected ? '#c6c6c6' : '#ffc000',
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
                      <Text style={styles.Text}>{item.name}</Text>
                      <Text style={styles.TextOne}>{item.description}</Text>
                      <Text style={styles.TextTwo}>
                        Rs{item.price}/
                        <Text style={{fontSize: 25}}>{item.validity}</Text>
                      </Text>
                      <Text style={styles.TextThree}>Days</Text>
                      <Text
                        style={{
                          backgroundColor: '#fff',
                          padding: 7,
                          marginTop: 4,

                          textAlign: 'center',
                          fontSize: 12,
                          color: '#000',
                        }}>
                        Select Package
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: '#4aab7e',
              marginTop: 20,
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
    </View>
  );
};

export default Membership;

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
    color: '#000',
    textAlign: 'center',
  },
  TextOne: {
    color: '#000',
    textAlign: 'center',
    fontSize: 10,
  },
  TextTwo: {
    color: '#000',
    textAlign: 'center',
    fontSize: 17,
  },
  TextThree: {
    color: '#000',
    textAlign: 'center',
    fontSize: 17,
  },
  TextFour: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
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
    width: '100%',
  },
  inputName: {
    marginTop: 10,
    fontSize: 12,
  },
});

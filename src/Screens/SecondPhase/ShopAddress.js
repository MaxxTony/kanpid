import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import Spinner from '../../Component/Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import {useStripe} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {checkEmail} from '../../Helpers/InputsNullChecker';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import { GOOGLE_API_KEY } from '../../Config';

const ShopAddress = props => {
  const navigation = useNavigation();

  const [billing_first_name, setFirstName] = useState('');
  const [billing_last_name, setLastName] = useState('');
  const [billing_country, setCountry] = useState('');
  const [billing_city, setCity] = useState('');
  const [billing_phone, setPhone] = useState('');
  const [billing_pincode, setPincode] = useState('');
  const [billing_email, setEmail] = useState('');
  const [billing_company_name, setCompanyName] = useState('');
  const [billing_house_no, setHouse] = useState('');
  const [currency, setCurrency] = React.useState('LKR');
  const [payment_type, setPaymentType] = React.useState('upi');
  const [payment_status, setPaymentStatus] = React.useState('200');

  const [loading, setLoading] = useState(false);
  const [user_id, setUserID] = useState();
  const [amount, setAmount] = useState();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    shippingAddress();
    countryData();
    setUserID(props?.route?.params?.user_id);
    setAmount(props?.route?.params?.amount);
    if (user_id != undefined) {
      //getCartItem();
    }
  }, [user_id]);

  const countryData = async () => {
    const response = await fetch(
      'https://trial.mobiscroll.com/content/countries.json',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    let json = await response.json();
    setCountryList(json);
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [currency]);

  const fetchPaymentSheetParams = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    const response = await fetch(
      `https://www.kanpid.lk/api/payment?user_id=${userId}&currency=${currency}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 500) {
      setPaymentStatus('500');
      setLoading(false);
    } else {
      setPaymentStatus('200');
      setLoading(false);
    }

    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      // console.log('there is no error all is good');
      //setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const emailcheck = checkEmail(billing_email);
    if (!emailcheck) {
      Toaster('Your email id is invalid');
      return;
    }
    if (billing_country == '') {
      Toaster('Phone Select the address properly in country field');
      return;
    }
    if (billing_phone.length < 10) {
      Toaster('Phone Number should be greater than 9 digit');
      return;
    }
    if (billing_pincode.length < 5) {
      Toaster('Pincode should be greater than 4 digit');
      return;
    }

    const {error} = await presentPaymentSheet();

    if (error) {
      //Alert.alert(`Error code: ${error.code}`, error.message);
      Alert.alert(`${error.code}`, error.message);
    } else {
      const user = await AsyncStorage.getItem('userDetail');
      const userId = JSON.parse(user).user_id;
      setLoading(true);
      GetApi(
        `shop-order-success?user_id=${userId}&transaction_id=12345&billing_first_name=${billing_first_name}&billing_last_name=${billing_last_name}&billing_country=${billing_country}&billing_city=${billing_city}&billing_phone=${billing_phone}&billing_pincode=${billing_pincode}&billing_email=${billing_email}&billing_company_name=${billing_company_name}&billing_house_no=${billing_house_no}&currency=${currency}`,
      ).then(
        async res => {
          setLoading(false);
          if (res.status == 200) {
            props.navigation.navigate('Thankyou');
          } else {
            Toaster('Something went wrong');
            return;
          }
        },
        err => {
          setLoading(false);
          Toaster('Something went wrong');
          console.log(err);
          return;
        },
      );
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  const shippingAddress = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;

    GetApi(`get-shipping-data?user_id=${userId}`).then(
      async res => {
        if (res.status == 200) {
          setFirstName(
            res.data.shipping_detail && res.data.shipping_detail.first_name
              ? res.data.shipping_detail.first_name
              : '',
          );
          setLastName(
            res.data.shipping_detail && res.data.shipping_detail.first_name
              ? res.data.shipping_detail.first_name
              : '',
          );
          setCountry(
            res.data.shipping_detail && res.data.shipping_detail.country
              ? res.data.shipping_detail.country
              : '',
          );
          setCity(
            res.data.shipping_detail && res.data.shipping_detail.city
              ? res.data.shipping_detail.city
              : '',
          );
          setPhone(
            res.data.shipping_detail && res.data.shipping_detail.phone
              ? res.data.shipping_detail.phone
              : '',
          );
          setPincode(
            res.data.shipping_detail && res.data.shipping_detail.pincode
              ? res.data.shipping_detail.pincode
              : '',
          );
          setEmail(
            res.data.shipping_detail && res.data.shipping_detail.email
              ? res.data.shipping_detail.email
              : '',
          );
          setCompanyName(
            res.data.shipping_detail && res.data.shipping_detail.company_name
              ? res.data.shipping_detail.company_name
              : '',
          );
          setHouse(
            res.data.shipping_detail && res.data.shipping_detail.house_no
              ? res.data.shipping_detail.house_no
              : '',
          );
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  const postOrder = () => {
    const emailcheck = checkEmail(billing_email);
    if (!emailcheck) {
      Toaster('Your email id is invalid');
      return;
    }
    if (billing_phone.length < 10) {
      Toaster('Phone Number should be greater than 9 digit');
      return;
    }
    if (billing_pincode.length < 5) {
      Toaster('Pincode should be greater than 4 digit');
      return;
    }
    setLoading(true);
    GetApi(
      `post-order?billing_first_name=${billing_first_name}&billing_last_name=${billing_last_name}&billing_country=${billing_country}&billing_city=${billing_city}&billing_phone=${billing_phone}&billing_pincode=${billing_pincode}&billing_email=${billing_email}&billing_company_name=${billing_company_name}&billing_house_no=${billing_house_no}&currency=${currency}&payment_type=${payment_type}&user_id=${user_id}&amount=${amount}`,
    ).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          console.log('res.data');
          props.navigation.navigate('Thankyou');
        } else {
          Toaster('Something went wrong');
          return;
        }
      },
      err => {
        setLoading(false);
        Toaster('Something went wrong');
        console.log('error aa gyi h bhai ', err);
        return;
      },
    );
  };

  const fetchCityByPostalCode = async postalCode => {
    try {
      const apiKey = GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postalCode}&key=${apiKey}`,
      );
      const data = await response.json();
      if (data?.status == 'ZERO RESULTS') {
        setCity('');
        setHouse('');
      }
      if (data.results && data.results.length > 0) {
        setHouse(data?.results[0].formatted_address);
        const city = data.results[0].address_components.find(component =>
          component.types.includes('locality'),
        );
        if (city) {
          // console.log(city?.long_name)
          setCity(city?.long_name);
        }
      }
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  return (
    <View style={{backgroundColor: '#fff'}}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView>
        <View style={{padding: 20}}>
          <Text style={{color: '#9AC96D'}}>Shipping Address</Text>

          <Text style={[styles.inputHeading1]}>First Name</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={billing_first_name}
            onChangeText={actualData => setFirstName(actualData)}
          />

          <Text style={[styles.inputHeading1]}>Last Name</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={billing_last_name}
            onChangeText={actualData => setLastName(actualData)}
          />

          <Text style={styles.inputHeading}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={billing_email}
            onChangeText={actualData => setEmail(actualData)}
          />

          <Text style={styles.inputHeading}>Phone</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType={'numeric'}
            autoCorrect={false}
            style={styles.input}
            value={billing_phone}
            onChangeText={actualData => setPhone(actualData)}
          />

          <Text style={[styles.inputHeading1]}>Country</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {
                borderWidth: 0,
                marginTop: 5,
                color: '#9e9e9eb8',
                backgroundColor: '#F0F0F0',
              },
            ]}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            placeholder="Select Country"
            data={countryList}
            maxHeight={300}
            labelField="text"
            valueField="text"
            value={billing_country}
            onChange={item => {
              setCountry(item.text);
            }}
          />

          <Text style={styles.inputHeading}>Pincode</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={'numeric'}
            style={styles.input}
            value={billing_pincode}
            onChangeText={actualData => {
              setPincode(actualData);
              fetchCityByPostalCode(actualData);
            }}
          />

          <Text style={[styles.inputHeading1]}>City</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={billing_city}
            onChangeText={actualData => setCity(actualData)}
          />

          <Text style={styles.inputHeading}>Address (Area and Street)</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputLarge}
            value={billing_house_no}
            onChangeText={actualData => setHouse(actualData)}
          />

          <Text style={styles.inputHeading}>Company Name</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={billing_company_name}
            onChangeText={actualData => setCompanyName(actualData)}
          />
          <Text style={styles.inputHeading}>Currency</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="LKR"
                color="#9AC96D"
                status={currency === 'LKR' ? 'checked' : 'unchecked'}
                onPress={() => setCurrency('LKR')}
              />
              <Text onPress={() => setCurrency('LKR')} style={{marginTop: 6}}>
                LKR
              </Text>
            </View>
          </View>
          <Text style={styles.inputHeading}>Payment Type</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <RadioButton.Android
                value="cod"
                color="#9AC96D"
                status={payment_type === 'cod' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentType('cod')}
              />
              <Text
                onPress={() => setPaymentType('cod')}
                style={{marginTop: 6}}>
                COD
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton.Android
                value="upi"
                color="#9AC96D"
                status={payment_type === 'upi' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentType('upi')}
              />
              <Text
                onPress={() => setPaymentType('upi')}
                style={{marginTop: 6}}>
                Credit / Debit Card
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (
                !billing_first_name ||
                !billing_last_name ||
                !billing_phone ||
                !billing_pincode ||
                !billing_email ||
                !currency ||
                !billing_house_no ||
                !payment_type ||
                !user_id ||
                !amount
              ) {
                Toaster('Please fill all the required fields');
                return;
              } else {
                if (payment_type == 'cod') {
                  postOrder();
                } else {
                  openPaymentSheet();
                }
              }
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              Save And Delivery Here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopAddress;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
  },
  inputLarge: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
    justifyContent: 'flex-start',
    minHeight: 100,
  },
  inputHeading: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
  },
  inputHeading1: {
    fontSize: 13,
    marginTop: 20,
    marginBottom: 6,
  },
  addBtn: {
    backgroundColor: '#9AC96D',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#9AC96D',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 130,
  },
  mainContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 20,
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
});

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Spinner from '../../Component/Spinner';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
const PaymentPage = props => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [card_no, setCardNo] = useState('');
  const [exp_month, setExpMonth] = useState('1');
  const [exp_year, setExpYear] = useState('2025');
  const [cvc, setCvc] = useState('');

  const [billing_first_name, setFirstName] = useState('');
  const [billing_last_name, setLastName] = useState('');
  const [billing_country, setCountry] = useState('');
  const [billing_state, setState] = useState('');
  const [billing_city, setCity] = useState('');
  const [billing_phone, setPhone] = useState('');
  const [billing_pincode, setPincode] = useState('');
  const [billing_email, setEmail] = useState('');
  const [billing_company_name, setCompanyName] = useState('');
  const [billing_house_no, setHouse] = useState('');
  const [currency, setCurrency] = React.useState('INR');
  const [payment_type, setPaymentType] = React.useState('cod');
  const [loading, setLoading] = useState(false);
  const [user_id, setUserID] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    setLoading(false);
    setUserID(props?.route?.params?.user_id);
    setAmount(props?.route?.params?.amount);
    setFirstName(props?.route?.params?.billing_first_name);
    setLastName(props?.route?.params?.billing_last_name);
    setCountry(props?.route?.params?.billing_country);
    setState(props?.route?.params?.billing_state);
    setCity(props?.route?.params?.billing_city);
    setPhone(props?.route?.params?.billing_phone);
    setPincode(props?.route?.params?.billing_pincode);
    setEmail(props?.route?.params?.billing_email);
    setCompanyName(props?.route?.params?.billing_company_name);
    setHouse(props?.route?.params?.billing_house_no);
    setCurrency(props?.route?.params?.currency);
    setPaymentType(props?.route?.params?.payment_type);
  }, []);

  const ExpYear = [
    {label: '2022', value: '2022'},
    {label: '2023', value: '2023'},
    {label: '2024', value: '2024'},
    {label: '2025', value: '2025'},
    {label: '2026', value: '2026'},
    {label: '2027', value: '2027'},
    {label: '2028', value: '2028'},
    {label: '2029', value: '2029'},
    {label: '2030', value: '2030'},
    {label: '2031', value: '2031'},
  ];

  const ExpMonth = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'},
    {label: '8', value: '8'},
    {label: '9', value: '9'},
    {label: '10', value: '10'},
    {label: '11', value: '11'},
    {label: '12', value: '12'},
  ];

  const postOrder = () => {
    setLoading(true);
    GetApi(
      `post-order?billing_first_name=${billing_first_name}&billing_last_name=${billing_last_name}&billing_country=${billing_country}&billing_state=${billing_state}&billing_city=${billing_city}&billing_phone=${billing_phone}&billing_pincode=${billing_pincode}&billing_email=${billing_email}&billing_company_name=${billing_company_name}&billing_house_no=${billing_house_no}&currency=${currency}&payment_type=${payment_type}&user_id=${user_id}&amount=${amount}&fullName=${fullName}&card_no=${card_no}&exp_month=${exp_month}&exp_year=${exp_year}&cvc=${cvc}&coupon_discount=0`,
    ).then(
      async res => {
        setLoading(false);
        console.log('---------------------');
        console.log(res);
        if (res.status == 200) {
          console.log('res.data');
          props.navigation.navigate('Thankyou');
        } else if (res.status == 201) {
          console.log('++++++++++++++++++++++++++++++++++++++++++++');
          let redirect_url = res.data;

          Linking.openURL(redirect_url);
        } else {
          console.log('-------------------------');
          Toaster(res.data);
          return;
        }
      },
      err => {
        console.log('ddddd');
        setLoading(false);
        Toaster('Something went wrong');
        return;
        console.log(err);
      },
    );
  };

  // const submit = () => {
  //     if (!billing_first_name && !billing_last_name && !billing_country && !billing_state && !billing_city && !billing_phone && !billing_pincode) {
  //         Alert.alert("please fill all the feilds")
  //     } else {
  //         navigation.navigate("Thankyou")
  //     }
  // }

  return (
    <View style={{backgroundColor: '#fff'}}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView>
        <View style={{padding: 20}}>
          <Text style={{color: '#9AC96D'}}>Payment</Text>
          <Text style={[styles.inputHeading1]}>Name</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={fullName}
            onChangeText={actualData => setFullName(actualData)}
          />
          <Text style={[styles.inputHeading1]}>Card Number</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={card_no}
            onChangeText={actualData => setCardNo(actualData)}
          />

          <View style={styles.addCartCon}>
            <View style={styles.dropSize}>
              <Text style={styles.inputDrop}>Exp Month :</Text>
              <Dropdown
                style={[styles.dropdown, {borderColor: 'black'}]}
                // placeholderStyle={styles.placeholderStyle}
                //selectedTextStyle={styles.selectedTextStyle}
                //inputSearchStyle={styles.inputSearchStyle}
                //iconStyle={styles.iconStyle}
                data={ExpMonth}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={exp_month}
                onChange={item => {
                  setExpMonth(item.value);
                }}
              />
            </View>

            <View style={styles.dropSize}>
              <Text style={styles.inputDrop}>Exp year :</Text>
              <Dropdown
                style={[styles.dropdown, {borderColor: 'black'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                //inputSearchStyle={styles.inputSearchStyle}
                //iconStyle={styles.iconStyle}
                data={ExpYear}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={exp_year}
                onChange={item => {
                  setExpYear(item.value);
                }}
              />
            </View>
            <View style={styles.dropSize}>
              <Text style={[styles.inputDrop]}>CVV</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input2}
                value={cvc}
                onChangeText={actualData => setCvc(actualData)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (!fullName || !card_no || !cvc) {
                Toaster('Please fill all the required fields');
                return;
              }
              postOrder();
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
  },
  input2: {
    backgroundColor: '#F0F0F0',
    padding: 4,
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
  inputDrop: {
    fontSize: 13,
    marginTop: 10,
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
  addCartCon: {
    // paddingRight: 20,
    // paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropSize: {
    width: 80,
  },
});

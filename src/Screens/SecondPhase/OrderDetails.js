import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';

import {useNavigation} from '@react-navigation/native';

const OrderDetails = ({route}) => {
  const navigation = useNavigation();

  const [invoice, setInvoice] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    getInvoice();
  }, []);
  const getInvoice = async () => {
    GetApi(`shop-orders-details/${Order}`).then(
      async res => {
        if (res.status == 200) {
          setInvoice(res.data.orderDetails);
          setOrderDetail(res.data.orderDetails.order_detail);

          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const Order = route.params.orderId;
  console.log(Order);
  return (
    <ScrollView>
      <View style={styles.firstView}>
        <Spinner color={'#ffc000'} visible={isLoaded} />

        <View style={{padding: 10}}>
          <View style={styles.firstFlex}>
            <Text style={styles.firstHeading}>Order ID: </Text>
            <Text style={styles.secondHeading}>#{invoice.id}</Text>
          </View>
          <View style={styles.firstFlex}>
            <Text style={styles.firstHeading}>Name:</Text>
            <Text style={styles.secondHeading}>{invoice.first_name}</Text>
          </View>
          <View style={styles.firstFlex}>
            <Text style={styles.firstHeading}>Address: </Text>
            <Text style={styles.secondHeading}>{invoice.house_no}</Text>
          </View>
          <View style={styles.firstFlex}>
            <Text style={styles.firstHeading}>Order Date:</Text>
            <Text>{invoice.created_at}</Text>
          </View>
          <View style={styles.firstFlex}>
            <Text style={styles.firstHeading}>Order Status: </Text>
            <Text style={styles.secondHeading}>{invoice.status}</Text>
          </View>
        </View>

        {orderDetail.map((item, index) => {
          return (
            <View style={{paddingHorizontal: 10, marginTop: 20}}>
              <View style={styles.detailcard}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomColor: '#E1E1E1',
                      borderBottomWidth: 2,
                      borderRightColor: '#E1E1E1',
                      borderRightWidth: 2,
                      //   height: 50,
                    }}>
                    <Text style={styles.cardtext}>Name</Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      paddingRight: 0,
                      flex: 3,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      borderBottomColor: '#E1E1E1',
                      borderBottomWidth: 2,
                    }}>
                    <Text style={styles.cardtext}>{item.product_name}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.featureName}>
                    <Text style={styles.cardtext}>Unit Price</Text>
                  </View>
                  <View style={styles.featureValue}>
                    <Text style={styles.cardtext}>Rs{item.product_price}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={styles.featureName}>
                    <Text style={styles.cardtext}>Quantity</Text>
                  </View>
                  <View style={styles.featureValue}>
                    <Text style={styles.cardtext}> {item.quantity}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={styles.featureName}>
                    <Text style={styles.cardtext}>Total</Text>
                  </View>
                  <View style={styles.featureValue}>
                    <Text style={styles.cardtext}>
                      Rs{item.product_price * item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{marginTop: 20}}>
          <View style={styles.lastSection}>
            <Text>Subtotal </Text>
            <Text style={{color: '#103524', fontSize: 15}}>
              {invoice.amount}
            </Text>
          </View>
          <View style={styles.lastSection}>
            <Text>Shipping </Text>
            <Text style={{color: '#103524', fontSize: 15}}>Free Shiping</Text>
          </View>
          <View style={styles.lastSection}>
            <Text>Coupon Discount </Text>
            <Text style={{color: '#103524', fontSize: 15}}>
              {invoice.coupon_discount}
            </Text>
          </View>
          <View style={styles.lastSection}>
            <Text>Total </Text>
            <Text style={{color: '#103524', fontSize: 15}}>
              {invoice.final_amount}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  firstView: {
    padding: 10,
  },
  title: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#000000',
  },
  detailcard: {
    backgroundColor: '#103524',
    borderColor: '#E1E1E1',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  cardtext: {
    color: '#fff',
    fontFamily: 'Mulish-SemiBold',
    fontSize: 13,
  },
  featureName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 2,
    borderRightColor: '#E1E1E1',
    borderRightWidth: 2,
    height: 50,
  },
  featureValue: {
    paddingLeft: 10,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 2,
    // height: 50,
  },
  detail: {
    color: '#000000',
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
  },
  lastSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#cdcdcd',
    marginRight: 25,
    marginLeft: 25,
    paddingTop: 15,
    paddingBottom: 15,
  },
  firstFlex: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    justifyContent: 'space-between',
  },
  firstHeading: {
    fontSize: 13,
    color: '#103524',
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
  },
  secondHeading: {
    fontSize: 13,
  },
});

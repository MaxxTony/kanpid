import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const width = Dimensions.get('window').width;

const DeleteAccount = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <View style={{paddingVertical: 10}}>
            <Text style={[styles.title]}>
              Please follow the below steps to delete your account.
            </Text>
            <Text style={[styles.des, {marginTop: 20}]}>
              1. Go to kanpid.com
            </Text>
            <Text style={styles.des}>
              2. Please log in first with your registered username and password.
            </Text>
            <Text style={styles.des}>
              3. Go to the sidebar and click on delete account.
            </Text>
            <Text style={styles.des}>
              4. There is a delete account page. Please click on the delete
              account button to delete the account.
            </Text>
            <Text style={styles.des}>
              5. After deleting, you will not be able to login into your
              account.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.copyrightView}>
        <Text style={styles.copyright}>
          Copyright © 2010-2023 Kanpid. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  copyrightView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    // marginTop: 50,
  },
  copyright: {
    color: '#848484',
    fontSize: 10,
    fontFamily: 'Mulish-SemiBold',
  },
  des: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 12,
    color: '#666666',
    lineHeight: 20,
  },
  title: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#000000',
  },
  kanpidView: {
    // width: 150,
    marginRight: 30,
    marginTop: 80,
    alignItems: 'flex-end',
  },
  line: {
    borderWidth: 1,
    borderColor: '#FFBE45',
    width: 70,
    marginLeft: 25,
    // marginTop: 5,
  },
});

export default DeleteAccount;

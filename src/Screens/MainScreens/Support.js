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

const Support = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View>
          <ImageBackground
            source={require('../../assets/Images/supportbg.png')}
            resizeMode="contain"
            style={{width, height: 200, marginTop: -5}}>
            <View style={styles.kanpidView}>
              <Image
                source={require('../../assets/Images/Support.png')}
                style={styles.kanpid}
              />
              <View style={styles.line}></View>
            </View>
          </ImageBackground>
        </View>

        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <View style={{paddingVertical: 10}}>
            <Text style={styles.title}>Need some help?</Text>
            <Text style={styles.des}>
              Our customer service representatives are available 24 hours a day,
              7 days a week to answer your questions. Whether you have a
              question about your account, about your item, or want to report a
              problem, we're here to help. You can reach us by phone, email, or
              live chat.
              {/* <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: '#9AC96D'}}>support@kanpid.com</Text>
              </TouchableOpacity> */}
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

export default Support;

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
  Linking,
} from 'react-native';
import React from 'react';
import {Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const width = Dimensions.get('window').width;

const FollowUs = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        <ScrollView>
          <View>
            <ImageBackground
              source={require('../../assets/Images/folow.png')}
              resizeMode="contain"
              style={{width, height: 200, marginTop: -5}}></ImageBackground>
          </View>

          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={{paddingVertical: 10}}>
              <Text style={styles.title}>Kanpid</Text>
              <Text style={styles.des}>
                Follow us to connect Kanpid, Lorem Ipsum is simply dummy text of
                the printing and typesetting industry.
              </Text>
            </View>
          </View>
          <Card style={[styles.browseCard]}>
            <Text style={styles.cardtitle}>
              Share to your friend by using this
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={{margin: 10}}
                onPress={async () => {
                  await Linking.openURL(
                    'https://www.linkedin.com/company/kanpid-limited',
                  );
                }}>
                <Image source={require('../../assets/Images/linkdin.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 10}}
                onPress={async () => {
                  await Linking.openURL('https://www.facebook.com/kanpidd/');
                }}>
                <Image source={require('../../assets/Images/face.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 10}}
                onPress={async () => {
                  await Linking.openURL(
                    'https://twitter.com/Kanpid_?t=qYwxN9hphE8XT5hub9CTyA&s=09',
                  );
                }}>
                <Image source={require('../../assets/Images/twitter.png')} />
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
      <View style={styles.copyrightView}>
        <Text style={styles.copyright}>
          Copyright © 2010-2023 Kanpid. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardtitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#1777CF',
    textAlign: 'center',
  },

  browseCard: {
    borderRadius: 10,
    shadowColor: '#1777CF',
    // shadowOffset: {
    //   width: 1,
    //   height: 1,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 13.97,
    // elevation: 10,
    margin: 20,
    padding: 20,
    // shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  copyrightView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 50,
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
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  kanpidView: {
    width: 150,
    marginLeft: 50,
    marginTop: 70,
  },
  line: {
    borderWidth: 1,
    borderColor: '#9AC96D',
    width: 110,
    marginLeft: 25,
    marginTop: 5,
  },
});

export default FollowUs;

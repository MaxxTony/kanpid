import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';

const width = Dimensions.get('window').width;

const AboutKanpid = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View>
          <ImageBackground
            source={require('../../assets/Images/aboutkanpid.png')}
            resizeMode="contain"
            style={{width, height: 200, marginTop: -5}}>
            <View style={styles.kanpidView}>
              <Image
                source={require('../../assets/Images/Kanpid.png')}
                style={styles.kanpid}
              />
              <View style={styles.line}></View>
            </View>
          </ImageBackground>
        </View>

        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <View style={{paddingVertical: 10}}>
            <Text style={styles.title}>About us</Text>
            <Text style={styles.des}>
              It is always frustrating to lose your things, especially if they
              are valuable or sentimental to you. Unfortunately, it happens to
              all of us at some point.
            </Text>

            <Text style={styles.des}>
              If you've ever lost something, you know the feeling of
              hopelessness that comes along with it. The sense of panic and
              dread can be overwhelming. Well, losing and finding back is a part
              of life, but it is too time-consuming and costly if it happens too
              often.
            </Text>

            <Text style={styles.des}>
              It is always frustrating to lose your things, especially if they
              are valuable or sentimental to you. Unfortunately, it happens to
              all of us at some point.This is where we come in. Our mission is
              to help people keep track of their belongings, so they never have
              to go through the hassle of losing them again. And with this same
              purpose, we started "Kanpid" because we wanted to create a better
              way for people to connect with each other. We believe that by
              providing a platform for people to share their lost and found
              items, we can make the world a little bit smaller and more
              connected.{' '}
            </Text>

            <Text style={styles.des}>
              IKanpid is a platform that allows users to upload pictures and
              information about lost and found items. If you have lost
              something, you can upload an image of the item and some
              information about where it was lost. If someone has found your
              lost item, they can upload the same picture on the website.
            </Text>

            <Text style={styles.des}>
              It's simple to start, so there's no reason not to give it a go!
            </Text>
          </View>

          {/* <View>
            <Text style={styles.title}>Our Story</Text>
            <Text style={styles.des}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </View> */}
        </View>

        <View style={styles.copyrightView}>
          <Text style={styles.copyright}>
            Copyright © 2010-2023 Kanpid. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 20,
  },
  title: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#000000',
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

export default AboutKanpid;

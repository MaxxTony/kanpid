import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {createRef, useState, useEffect} from 'react';
import {Avatar, Card} from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import {GetApi} from '../../Helpers/Service';
import moment from 'moment';

const actionSheetRef = createRef();

const Notification = props => {
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getuserDetail();
    });
    return () => {
      willFocusSubscription;
    };
  }, []);

  const getuserDetail = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    // console.log("user info",JSON.parse(user));
    if (user === null) {
      setShowDetail(false);
      actionSheetRef.current?.setModalVisible();
    } else {
      setShowDetail(true);
      getNotification(JSON.parse(user).user_id);
    }
  };

  const getNotification = id => {
    setLoading(true);
    GetApi(`get_notifications?user_id=${id}`).then(async res => {
      setLoading(false);
      // console.log("user notification info",res);
      if (res.status == 200) {
        console.log('_+_+_+_+', res.data);
        setNotificationList(res.data);
      }
    });
  };

  const viewNotification = item => {
    if (item?.type === 'ITEM') {
      props.navigation.navigate('ProductView', {
        itemId: item?.item_slug,
      });
    }
    if (item?.type === 'CHAT') {
      props.navigation.navigate('Chat', {
        chatUser_id: item?.user_id,
        user_img: item?.user_profile_image,
        user_name: item?.first_name,
      });
    }
  };

  const cardItem = () => (
    <View>
      {notificationList.map(item => (
        <Card style={styles.card} key={item.id}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => viewNotification(item)}>
            <Image
              source={
                item?.image != null
                  ? {uri: `${Constants.imageUrl}images/${item.image}`}
                  : require('../../assets/Images/images.png')
              }
              resizeMode="contain"
              style={{height: 60, width: 60, borderRadius: 50}}
            />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text style={styles.nametext}>{item.first_name}</Text>
              <Text style={styles.description}>{item.message}</Text>
              <View
                style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <Text style={styles.time}>
                  {moment(item.created_at).format('hh:mmA')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );

  return (
    <>
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <Spinner color={'#fff'} visible={loading} />
        {showDetail && (
          <ScrollView>
            {notificationList.length > 0 ? (
              cardItem()
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>There is no Notification</Text>
              </View>
            )}
          </ScrollView>
        )}

        <ActionSheet
          ref={actionSheetRef}
          containerStyle={{backgroundColor: '#fff'}}>
          <View style={styles.actionMainView}>
            <View
              style={{
                backgroundColor: '#4AAB7E',
                width: 50,
                height: 5,
                borderRadius: 25,
                marginBottom: 30,
              }}></View>

            <Text style={{color: '#4AAB7E', fontSize: 16}}>
              Please login to notification
            </Text>
            <TouchableOpacity
              style={{marginTop: 30}}
              onPress={() => {
                props.navigation.navigate('Signin');
                actionSheetRef.current?.hide();
              }}>
              <Text style={styles.actionBtn}>Login</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </SafeAreaView>
      <View style={styles.copyrightView}>
        <Text style={styles.copyright}>
          Copyright © 2010-2023 Kanpid. All rights reserved.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: '#4AAB7E',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionMainView: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  copyrightView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  copyright: {
    color: '#848484',
    fontSize: 12,
    fontFamily: 'Mulish-SemiBold',
    fontWeight: 'bold',
  },

  time: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Mulish-Bold',
    // marginTop: 5,
    // textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Mulish-Medium',
    marginTop: 3,
  },
  nametext: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Mulish-Bold',
  },
  card: {
    borderRadius: 5,
    padding: 10,
    // paddingHorizontal: '5%',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 0,
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
});
export default Notification;

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useEffect, useState, createRef} from 'react';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actions-sheet';
import moment from 'moment';

const actionSheetRef = createRef();

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Inbox = props => {
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState([]);

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
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      getChatList(JSON.parse(user).user_id);
    }
  };

  const getChatList = id => {
   
    setLoading(true);
    GetApi(`getChatData?id=${id}`).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          setChatList(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cardItem = () => (
    <>
      {chatList.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            props.navigation.navigate('Chat', {
              chatUser_id: item.sender_id,
              user_img: `${Constants.imageUrl}images/${item.image}`,
              user_name: item.first_name,
            });
            // props.navigation.navigate('Chat', {chatUser_id: item.receiver_id});
          }}>
          <Card style={styles.card}>
            <View style={{flexDirection: 'row'}}>
              <Image
                // size={50}
                source={
                  item?.image != null
                    ? {uri: `${Constants.imageUrl}images/${item.image}`}
                    : require('../../assets/Images/images.png')
                }
                resizeMode="contain"
                style={{height: 50, width: 50, borderRadius: 50}}
              />
              <View style={{marginLeft: 10, flex: 1}}>
                <Text style={styles.nametext}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.description}>
                  {item.message}{' '}
                  {item.message !== '' && item.created_at !== null && '|'}{' '}
                  {item.created_at !== null &&
                    moment(item.created_at).format('DD/MM/yyyy')}
                </Text>
                <View
                  style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                  <Text style={styles.time}>
                    {item.created_at !== null &&
                      moment(item.created_at).format('h:mm A')}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </>
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const user = await AsyncStorage.getItem('userDetail');
    getChatList(JSON.parse(user).user_id);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <Spinner color={'#fff'} visible={loading} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {cardItem()}
        </ScrollView>
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
              Please login to inbox
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

  avatar: {},
  card: {
    borderRadius: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 1,
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
});

export default Inbox;

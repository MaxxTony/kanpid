import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {Avatar} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GetApi} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Profile = props => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getuserDetail();
    });
    return () => {
      willFocusSubscription;
      setUserDetail({});
    };
  }, []);

  const getuserDetail = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log('USER : ', JSON.parse(user));
    if (user === null) {
      setShowDetail(false);
      actionSheetRef.current?.setModalVisible();
    } else {
      setShowDetail(true);
      getProfile(JSON.parse(user).user_id);
    }
  };

  const getProfile = id => {
    setLoading(true);
    GetApi(`getProfileById?id=${id}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status == 200) {
          console.log(res.data);
          setUserDetail(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const user = await AsyncStorage.getItem('userDetail');
    if (user !== null) {
      setShowDetail(true);
      getProfile(JSON.parse(user).user_id);
    }

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Spinner color={'#fff'} visible={loading} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.backArow}
              onPress={() => props.navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          {showDetail && (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingEnd: 20,
              }}>
              <TouchableOpacity
                style={styles.editbtm}
                onPress={() => {
                  props.navigation.navigate('EditProfile');
                }}>
                <Text style={styles.edittext}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {showDetail && (
          <View>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <View style={styles.avtarView}>
                <Avatar.Image
                  size={120}
                  source={
                    userDetail?.image !== null
                      ? {uri: `${Constants.imageUrl}images/${userDetail.image}`}
                      : require('../../assets/Images/images.png')
                  }
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.name}>
                {userDetail?.first_name} {userDetail.last_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                marginTop: 15,
              }}>
              <Pressable
                onPress={() => {
                  props.navigation.navigate('SerarchResult', {
                    type: `search_request?user_id=${userDetail.user_id}&item_type=1`,
                  });
                }}
                style={[
                  styles.lostfoundItem,
                  {backgroundColor: '#4AAB7E', marginEnd: 5},
                ]}>
                <Text style={styles.lostText}>Lost Items</Text>
                <Text style={styles.lostcount}>{userDetail?.lost_items}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  props.navigation.navigate('SerarchResult', {
                    type: `search_request?user_id=${userDetail.user_id}&item_type=2`,
                  });
                }}
                style={[
                  styles.lostfoundItem,
                  {backgroundColor: '#9AC96A', marginStart: 5},
                ]}>
                <Text style={styles.lostText}>Found Items</Text>
                <Text style={styles.lostcount}>{userDetail?.found_items}</Text>
              </Pressable>
            </View>

            <View
              style={{paddingHorizontal: 20, marginTop: 40, paddingBottom: 20}}>
              <View>
                <Text style={styles.label}>Email</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#D8D8D8',
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                  }}>
                  <Ionicons
                    name="mail-outline"
                    size={25}
                    color="#9AC96A"></Ionicons>
                  <Text style={styles.detailField}>{userDetail.email}</Text>
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={styles.label}>Mobile</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#D8D8D8',
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                  }}>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={25}
                    color="#9AC96A"></Ionicons>
                  <Text style={styles.detailField}>{userDetail.phone}</Text>
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#D8D8D8',
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                  }}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={25}
                    color="#9AC96A"></Ionicons>
                  <Text style={styles.detailField}>**********</Text>
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={styles.label}>My Address</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#D8D8D8',
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                  }}>
                  <Ionicons
                    name="location-outline"
                    size={25}
                    color="#9AC96A"></Ionicons>
                  <Text style={styles.detailField}>{userDetail?.address}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <ActionSheet
        ref={actionSheetRef}
        closeOnTouchBackdrop={false}
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
            Please login to profile
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
  label: {
    color: '#8B8B8B',
    fontFamily: 'Mulish-Medium',
    fontWeight: '500',
    fontSize: 16,
  },
  detailField: {
    color: '#000',
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  lostText: {
    fontFamily: 'Mulish-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#fff',
  },

  lostcount: {
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 18,
    color: '#fff',
    marginTop: 10,
  },

  lostfoundItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },

  name: {
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
    marginTop: 20,
  },

  backArow: {
    backgroundColor: '#9AC96D',
    height: 35,
    width: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  editbtm: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 25,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  edittext: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
  avtarView: {
    height: 130,
    width: 130,
    borderColor: '#fff',
    borderWidth: 5,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
});

export default Profile;

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Constants from '../../Helpers/constant';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actions-sheet';
import SharePost from '../../Component/SharePost';

const actionSheetRef = createRef();

// uri: Constants.imageUrl + 'images/' + item.image,
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Searchresult = props => {
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [itemList, setItemList] = useState([]);
  const [name, setName] = useState('');
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    setType(`${props?.route?.params?.type}&order_by=${sort}`);

    if (type != '') {
      if (type.includes('user_id')) {
        setShowTrash(true);
      }
      getdata(type);
    }
  }, [type]);

  const getdata = url => {
    setLoading(true);
    GetApi(url).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          console.log(res.data);
          setItemList(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const editpost = item => {
    props.navigation.navigate('PostYourItem', {
      type: item.item,
      item_id: item.id,
    });
  };

  const deleteItem = item_id => {
    setLoading(true);
    const data = {
      item_id,
    };
    Post('item_delete', data).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          getdata(type);
          // setType(type);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const chatClick = async item => {
    const user = await AsyncStorage.getItem('userDetail');
    setLoading(true);
    const data = {
      current_user_id: JSON.parse(user).user_id,
      receiver_id: item.user_id,
    };
    Post(`chatClick`, data).then(
      async res => {
        setLoading(false);
        if (res.status == 200) {
          props.navigation.navigate('Chat', {
            chatUser_id: item.user_id,
            user_img: item.user_profile_image,
            user_name: item.first_name,
          });
          // props.navigation.navigate('Chat', {chatUser_id: chatId});
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getuserDetail = async item => {
    const user = await AsyncStorage.getItem('userDetail');
    console.log(JSON.parse(user));
    if (user === null) {
      actionSheetRef.current?.setModalVisible();
    } else {
      chatClick(item);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getdata(type);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const card = () => {
    return (
      <View>
        {itemList.map(item => (
          <View style={styles.cardView} key={item.id}>
            {/* {userDetail?.phone} */}
            <View
              style={[
                styles.typeItem,
                {backgroundColor: item.item === '1' ? 'red' : 'green'},
              ]}>
              <Text style={styles.typeItemText}>
                {item.item === '1' ? 'Lost' : 'Found'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ProductView', {
                  itemId: item.item_slug,
                });
              }}>
              <Image
                source={{uri: Constants.imageUrl + 'images/' + item.image}}
                resizeMode="cover"
                style={{height: 130, width: 90, borderRadius: 10}}
              />
            </TouchableOpacity>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.cardTitle}>{item.item_name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardfeture}>
                {item.brand_name} | {item.colour} |
                {moment(item.time, 'HH:mm').format('h:mm A')}
                {'\n'}
                {item.location}
              </Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.iconView}
                  onPress={() => {
                    props.navigation.navigate('ProductView', {
                      itemId: item.item_slug,
                    });
                  }}>
                  <Ionicons name="eye-outline" size={18} color="#fff" />
                </TouchableOpacity>
                {!showTrash && (
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      getuserDetail(item);
                    }}>
                    <Ionicons name="chatbox-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.iconView, {marginLeft: 5}]}
                  onPress={() => {
                    SharePost({
                      post_id: item.item_slug,
                      description: item.description,
                      screen: 'ProductView',
                      title: item.item_name,
                      image: Constants.imageUrl + 'images/' + item.image,
                    }).then(res => {
                      console.log(res);
                    });
                  }}>
                  <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
                </TouchableOpacity>
                {showTrash && (
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      editpost(item);
                    }}>
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}

                {showTrash && (
                  <TouchableOpacity
                    style={[styles.iconView, {marginLeft: 5}]}
                    onPress={() => {
                      deleteItem(item.id);
                    }}>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{padding: 20, backgroundColor: '#fff', flex: 1}}>
      <Spinner color={'#fff'} visible={loading} />
      <View style={{flexDirection: 'row'}}>
        <View style={styles.fiedView}>
          <Ionicons name="search-outline" size={25} color="#4AAB7E" />
          <TextInput
            style={styles.detailField}
            placeholder="Search what you lost?"
            value={name}
            onChangeText={text => {
              setName(text);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.fitericonView}
          onPress={() => {
            getdata(
              `${props?.route?.params?.type}&order_by=${sort}&item_name=${name}`,
            );
          }}>
          <FontAwesome5 name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.sortView}>
        <View
          style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
          <Text style={styles.sort}>SORT BY :</Text>
        </View>
        <View
          style={{
            flex: 1.3,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Picker
            style={[styles.inputView3, sort == '' ? {color: '#000'} : {}]}
            selectedValue={sort}
            height={45}
            itemStyle={styles.itempeacker}
            onValueChange={(itemValue, itemIndex) => {
              setSort(itemValue);
              setType(`${props?.route?.params?.type}&order_by=${itemValue}`);
              // getdata(`${props?.route?.params?.type}&order_by=${itemValue}`);
            }}>
            {/* <Picker.Item label="Date Published" value="" /> */}
            <Picker.Item label="Start List (A-Z)" value="asc" />
            <Picker.Item label="Start List (Z-A)" value="desc" />
          </Picker>
        </View>
      </View>
      <View style={{flex: 1, paddingTop: 5}}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          {itemList && itemList?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
              }}>
              <Text style={{fontSize:20,color:"#000"}}>No Result Found</Text>
            </View>
          ) : (
            card()
          )}
        </ScrollView>
      </View>
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
            Please login to chat
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
  typeItemText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    margin: 5,
  },
  typeItem: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 70,
    borderBottomRightRadius: 5,
  },
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
  iconView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AAB7E',
  },
  cardDate: {
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Mulish-SemiBold',
    marginTop: 10,
  },
  cardfeture: {
    color: '#2C2C2C',
    fontSize: 10,
    fontFamily: 'Mulish-SemiBold',
    marginTop: 5,
  },
  cardDesc: {
    color: '#2C2C2C',
    fontSize: 12,
    fontFamily: 'Mulish-SemiBold',
    marginTop: 5,
  },
  cardTitle: {
    color: '#103524',
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
  },
  cardView: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    marginTop: 10,
    paddingBottom: 40,
  },
  itempeacker: {
    margin: 0,
    padding: 0,
  },
  inputView3: {
    // borderRadius: 8,
    // backgroundColor: '#F0F0F0',
    padding: 0,
    width: '95%',
    margin: 0,
    fontSize: 16,
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
    color: '#000',
    minHeight: 50,
  },
  sort: {
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
    color: '#000',
  },
  sortView: {
    flexDirection: 'row',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 2,

    // marginTop: 20,
  },
  fitericonView: {
    backgroundColor: '#4AAB7E',
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  detailField: {
    color: '#000',
    fontFamily: 'Mulish-SemiBold',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },

  fiedView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    // borderWidth:2,
    borderRadius: 5,
    height: 45,
  },
});

export default Searchresult;

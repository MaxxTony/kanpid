import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import Toaster from '../../Component/Toaster';
import {useNavigation} from '@react-navigation/native';
import ReadMore from 'react-native-read-more-text';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import RNFetchBlob from 'rn-fetch-blob';

const YourOrders = () => {
  const navigation = useNavigation();

  const [itemList, setItemList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceDataOne, setInvoiceDataOne] = useState([]);

  useEffect(() => {
    getAllOrdersItem();
  }, []);
  const getAllOrdersItem = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userId = JSON.parse(user).user_id;
    GetApi(`shop-my-orders?user_id=${userId}`).then(
      async res => {
        if (res.status == 200) {
          setItemList(res.data.allorder);

          setIsLoaded(false);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const downloadInvoice = async id => {
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = `https://www.kanpid.lk/shop-item/post-download-invoice/${id}`;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Toaster('Invoice download successfully');
      });
  };
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  return (
    <View style={styles.firstContainer}>
      <Spinner color={'#ffc000'} visible={isLoaded} />
      <Text style={{fontSize: 15}}>All Orders</Text>
      <FlatList
        data={itemList}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <View style={styles.boxContainer}>
              <View style={{width: '35%'}}>
                {
                  item.order_detail.map((newItem, newIndex) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('OrderDetails', {
                            orderId: newItem.order_id,
                          });
                        }}>
                        <Image
                          resizeMode="contain"
                          style={{width: 100, height: 100, borderRadius: 10}}
                          source={{
                            uri:
                              Constants.imageUrl +
                              'category-image/' +
                              newItem.product_image,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })[0]
                }
              </View>

              <View style={{marginLeft: 10, width: '65%'}}>
                {
                  item.order_detail.map((newItem, newIndex) => {
                    return (
                      <View>
                        <Text>{newItem.product_name}</Text>
                      </View>
                    );
                  })[0]
                }
                <ReadMore
                  numberOfLines={2}
                  renderTruncatedFooter={handlePress => {
                    return;
                  }}
                  renderRevealedFooter={handlePress => {
                    return;
                  }}>
                  <Text style={{fontSize: 12}}>Address:{item.house_no}</Text>
                </ReadMore>
                <Text style={{fontSize: 12, marginTop: 6}}>{item.status}</Text>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <View>
                    <Text>${item.amount}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <TouchableOpacity
                      onPress={() => {
                        //inVoicePdf();
                        downloadInvoice(item.id);
                      }}>
                      <FontAwesome5
                        name="download"
                        style={{
                          fontSize: 13,
                          color: '#ffc000',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>

                    {
                      item.order_detail.map((newItem, newIndex) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('OrderDetails', {
                                orderId: newItem.order_id,
                              });
                            }}>
                            <FontAwesome5
                              name="eye"
                              style={{
                                fontSize: 14,
                                color: '#9ac96c',
                                marginRight: 10,
                              }}
                            />
                          </TouchableOpacity>
                        );
                      })[0]
                    }
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default YourOrders;

const styles = StyleSheet.create({
  firstContainer: {
    padding: 20,
    marginBottom: 30,
  },
  boxContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#9ac96d',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
});

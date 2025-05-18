import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Toaster from '../../Component/Toaster';
import Constants from '../../Helpers/constant';
import Spinner from '../../Component/Spinner';
import Entypo from 'react-native-vector-icons/Entypo';

const UsedItemUploadImage = ({route}) => {
  const navigation = useNavigation();

  const item_id = route.params.productId;
  const [image, setImage] = useState('');
  const [allImage, setAllImage] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllImage();
  }, []);
  const getAllImage = async () => {
    setLoading(true);
    GetApi(`used-item/get-upload-image/${item_id}`).then(
      async res => {
        if (res.status == 200) {
          setLoading(false);
          setAllImage(res.data.product_image);
          //console.log(res.data.product_image);
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      const docFinal = {
        uri: doc[0].uri,
        type: doc[0].type,
        name: doc[0].name,
      };
      setImage(docFinal);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User Cancelled the upload', err);
      } else {
        console.log(err);
      }
    }
  };
  const uploadImage = async () => {
    setLoading(true);
    console.log('submit click');
    console.log(image);
    //return false;
    if (image == '') {
      Toaster('Please select a image');
      setLoading(false);
      return false;
    }
    const formData = new FormData();
    formData.append('item_id', item_id);
    formData.append('product_image', image);
    axios({
      method: 'post',
      url: 'https://www.kanpid.lk/api/used-item/post-upload-image',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        //handle success
        setLoading(false);
        Toaster('You have successfully uploaded image');
        setImage('');
        getAllImage();
        // console.log("new axios then");
        //console.log(response.data);
      })
      .catch(function (response) {
        setLoading(false);
        Toaster('You have successfully uploaded image');
        setImage('');
        getAllImage();

        //handle error
        // Toaster('Something went wrong');
        // //console.log("new axios catch");
        // console.log(response.data);
      });
  };
  const deleteImage = async item_id => {
    setLoading(true);
    GetApi(`used-item/delete-upload-image/${item_id}`).then(
      async res => {
        getAllImage();
        Toaster('You have successfully deleted image');
        setIsLoaded(false);
        // if (res.status == 200) {
        //     getAllImage();
        //     setIsLoaded(false)
        // }
      },
      err => {
        setIsLoaded(false);
        console.log(err);
      },
    );
  };

  return (
    <View>
      <Spinner color={'#ffc000'} visible={loading} />
      <ScrollView>
        <View>
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <Text
              style={{
                paddingTop: 10,
                fontWeight: 'bold',
                color: '#000000',
                fontSize: 16,
              }}>
              Upload Image
            </Text>
            <Text style={[styles.inputHeading]}>Image:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                selectDoc();
              }}>
              <Text style={{fontSize: 13}}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                uploadImage();
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>Upload</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.flatlistView}
            numColumns={3}
            data={allImage}
            renderItem={({item}) => {
              //console.log(item.item.image);
              return (
                <View style={{width: '35%'}}>
                  <TouchableOpacity
                    style={styles.cross}
                    onPress={() => {
                      deleteImage(item.id);
                    }}>
                    <Entypo name="cross" />
                  </TouchableOpacity>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    source={{
                      uri: Constants.imageUrl + 'category-image/' + item.image,
                    }}
                  />
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UsedItemUploadImage;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#9e9e9eb8',
  },
  flatlistView: {
    margin: 10,
  },
  inputHeading: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 6,
    //paddingLeft: 20
  },
  addBtn: {
    backgroundColor: '#103524',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#103524',
    borderRadius: 5,
    marginTop: 15,
    //marginBottom: 130,
  },
  cross: {
    backgroundColor: '#ffc000',
    color: '#fff',
    width: 20,
    height: 20,
    borderRadius: 30,
    paddingLeft: 3.5,
    paddingTop: 3,
    position: 'absolute',
    top: 8,
    right: 18,
    zIndex: 9999,
  },
});

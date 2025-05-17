import axios from 'axios';
import Constants from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Post = async (url, data) => {
  // console.log(Constants.baseUrl + url);
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  return axios
    .post(Constants.baseUrl + url, data)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      if (err.response) {
        return err.response;
      }
    });
};

const GetApi = async url => {
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  return axios
    .get(Constants.baseUrl + url, {
      headers: {
        Authorization: `Bearer ${userDetail?.token | ''}`,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        console.log(err.response.data);
      }
      return err;
    });
};

export {Post, GetApi};

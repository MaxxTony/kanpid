import {View, Text, Share} from 'react-native';
import React from 'react';
import Constants from '../Helpers/constant';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const SharePost = async data => {
  const param = {
    link: `${Constants.baseUrl}${data.post_id}?screen=${data.screen}`,
    domainUriPrefix: 'https://kanpidnivethika.page.link',
    android: {
      packageName: 'com.kanpid.shop',
      fallbackUrl:
        'https://play.google.com/store/apps/details?id=com.kanpid.shop',
      // fallbackUrl: `https://www.kanpid.lk/item-view/${data.post_id}`,
    },
    // ios: this._iosConfig,
    social: {
      title: data.title,
      descriptionText: data.description,
      imageUrl: data.image,
    },
    navigation: {
      forcedRedirectEnabled: false,
    },
    enableForcedRedirect: 1,
    analytics: {
      campaign: 'banner',
    },
  };
  console.log('params', param);
  const link = await dynamicLinks().buildShortLink(param, 'SHORT');
  console.log('link', link);
  // try {
  return await Share.share({
    Url: link,
    message: link || '',
    title: link || '',
  });
};

export default SharePost;

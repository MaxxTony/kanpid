import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Copyrights = () => {
  return (
    <View style={styles.copyrightView}>
      <Text style={styles.copyright}>
        Copyright © 2010-2023 Kanpid. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  copyrightView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    // marginTop: 50,
  },
  copyright: {
    color: '#848484',
    fontSize: 10,
    fontFamily: 'Mulish-SemiBold',
  },
});

export default Copyrights;

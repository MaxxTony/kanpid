// import {View, Text} from 'react-native';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import React from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const width = Dimensions.get('screen').width;
const CoustomDropdown = props => {
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={props.visible}
      style={{zIndex: 1100}}
      onRequestClose={() => {}}>
      <Pressable
        style={Styles.modalBackground}
        onPress={() => props.getDropValue('Select', '')}>
        <View style={Styles.activityIndicatorWrapper}>
          <View
            style={{
              borderColor: '#F0F0F0',
              borderWidth: 2,
              borderRadius: 10,
              padding: 20,
              width: width * 0.8,
              backgroundColor: 'white',
            }}>
            {!!props.title && (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: 'black',
                  marginBottom: 18,
                  fontFamily: 'Helvetica',
                }}>
                {props.title}
              </Text>
            )}
            {props.data !== undefined &&
              props.data.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    color: 'black',
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: '700',
                    // borderBottomColor: 'black',
                    // borderBottomWidth: 1,
                    paddingBottom: 5,
                  }}
                  onPress={() => props.getDropValue(item.name, item.type)}>
                  {item.name}
                </Text>
              ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    // height:'80%',
    // width:'80%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  activityIndicatorWrapper: {
    flex: 1,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 210,
    // justifyContent: 'space-around',
  },
});

export default CoustomDropdown;

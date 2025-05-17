import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const UsedThankYou = () => {
  const navigation = useNavigation();
  useEffect(() => {
    console.log('useEffect executed');
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('Back button pressed');
      navigation.navigate('Home-New'); // Navigate to the desired screen
      return true; // Return true to indicate that you've handled the back button event
    });
  
    return () => {
      console.log('Clean up');
      backHandler.remove(); // Clean up the event listener on component unmount
    };
  }, []);
  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <View>
        <Image
          source={require('../../assets/img/thanks.png')}
          style={styles.img}
        />
        <Text style={styles.heading}>Thank You!</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            navigation.navigate('Home-New');
          }}>
          <Text style={styles.heading2}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsedThankYou;

const styles = StyleSheet.create({
  img: {
    alignSelf: 'center',
    marginTop: 150,
  },
  heading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 24,
  },
  heading1: {
    textAlign: 'center',
    marginTop: 1,
    fontSize: 14,
  },
  heading2: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    marginTop: 270,
    fontSize: 14,
    color: '#8d8d8d',
  },
  addBtn: {
    backgroundColor: '#9AC96D',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#9AC96D',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 130,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

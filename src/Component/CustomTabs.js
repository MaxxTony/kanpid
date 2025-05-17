import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const CustomTabs = ({state, descriptors, navigation}) => {
  const CustomButton = props => {
    // console.log('buttonProps=====================>', props)
    return (
      <LinearGradient
        colors={['#FF7B97', '#C2012A']}
        style={{
          height: 60,
          width: 60,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          bottom: 20,
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 0.58,
          shadowRadius: 40,
          elevation: 12,
          shadowColor: 'lightgrey',
        }}>
        <Image
          source={require('../assets/img/home.png')}
          style={{height: 25, width: 25}}
        />
      </LinearGradient>
    );
  };

  return (
    <View
      style={{
        // position: 'absolute',
        // marginTop: 70,
        height: 70,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.58,
        shadowRadius: 40,
        elevation: 3,
        shadowColor: 'lightgrey',
        bottom: 0,
        width: '100%',
      }}>
      {state.routes.map((route, index) => {
        // if (index == 0 || index == 1 || index == 3 || index == 4) {
        //     return null
        // }
        const isFocus = route.index == index;
        const {options} = descriptors[route.key];

        const tabButton = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocus && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              tabButton();
            }}
            testID={options.tabBarTestId}
            accessibilityRole="button">
            {/* {
                            index === 0 && (
                                <View >
                                    <Image source={require('../Assets/Images/tabhousehold.png')} style={{ height: 25, width: 25 }} />
                                </View>

                            )
                        } */}

            {/* {
                            index === 1 && (
                                <View >
                                    <Image source={require('../Assets/Images/star.png')} style={{ height: 25, width: 25 }} />
                                </View>

                            )
                        } */}
            {index === 0 && (
              <View>
                <Image
                  source={require('../assets/img/profile.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
            )}

            {index === 1 && <CustomButton />}

            {index === 2 && (
              <View>
                <Image
                   source={require('../assets/img/profile.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabs;

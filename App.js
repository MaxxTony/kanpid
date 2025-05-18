import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainRoutes from './src/Routes/MainRoutes';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';
import {StripeProvider} from '@stripe/stripe-react-native';

const APP_ID = 'b00faf62-d933-443b-b03a-a9813b30799c';
const SENDER_ID = '1088833333526';

import {LogBox} from 'react-native';
import {Provider} from 'react-native-paper';

const App = () => {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

  LogBox.ignoreAllLogs(); //Ignore all log notifications

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(APP_ID);

    OneSignal.getDeviceState().then(async res => {
      // console.log(res);
      // await AsyncStorage.setItem('pushObj', JSON.stringify(res));
    });

    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();

        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );
  }, [OneSignal]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const config = {
    screens: {
      ProductView: {
        path: 'ProductView/:itemId',
      },
    },
  };

  return (
    <StripeProvider
      publishableKey="pk_live_51MjgxiFMffulFtJ3CRsCWGYV8eFc8vntRz5uDIo4asyWlkvZDvcBNkmAlOCRjuVlFgsGNKSsqJ7lOpBsqkZA76Wr00SxBhA65V"
      urlScheme="your-url-scheme"
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}">
      <Provider>
        <NavigationContainer>
          <StatusBar backgroundColor="#103524" />
          <MainRoutes />
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
};

export default App;

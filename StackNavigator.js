import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import { AudioProvider, useAudio } from './src/context/AudioContext';


const Stack = createNativeStackNavigator();

const HungryWolfStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isHungryWolfOnbVisible, setIsHungryWolfOnbVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingHungryWolfApp, setInitializingHungryWolfApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadHungryWolfUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedWolfUser = await AsyncStorage.getItem(storageKey);
        const isOnbWasVisible = await AsyncStorage.getItem('isOnbWasVisible');

        if (storedWolfUser) {
          setUser(JSON.parse(storedWolfUser));
          setIsHungryWolfOnbVisible(false);
        } else if (isOnbWasVisible) {
          setIsHungryWolfOnbVisible(false);
        } else {
          setIsHungryWolfOnbVisible(true);
          await AsyncStorage.setItem('isOnbWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of cur user', error);
      } finally {
        setInitializingHungryWolfApp(false);
      }
    };
    loadHungryWolfUser();
  }, [setUser]);

  if (initializingHungryWolfApp) {
    return (
      <View style={{
        backgroundColor: 'rgba(12, 132, 167, 1)',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AudioProvider>
        <Stack.Navigator initialRouteName={isHungryWolfOnbVisible ? 'OnboardingScreen' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};


export default HungryWolfStack;

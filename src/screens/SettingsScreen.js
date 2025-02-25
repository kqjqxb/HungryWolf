import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Switch,
} from 'react-native';

const fontPoppinsRegular = 'Poppins-Regular';

const SettingsScreen = ({ setSelectedScreen, isNotificationEnabled, setNotificationEnabled, isSoundEnabled, setSoundEnabled,  isVibrationEnabled, setVibrationEnabled, isMusicEnabled, setMusicEnabled }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const toggleNotificationSwitch = () => {
    const newValue = !isNotificationEnabled;
    setNotificationEnabled(newValue);
    saveSettings('isNotificationEnabled', newValue);
  };
  const toggleSoundSwitch = () => {
    const newValue = !isSoundEnabled;
    setSoundEnabled(newValue);
    saveSettings('isSoundEnabled', newValue);
  };
  const toggleMusicSwitch = () => {
    const newValue = !isMusicEnabled;
    setMusicEnabled(newValue);
    saveSettings('isMusicEnabled', newValue);
  };

  const toggleVibrationSwitch = () => {
    const newValue = !isVibrationEnabled;
    setVibrationEnabled(newValue);
    saveSettings('isVibrationEnabled', newValue);
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      flex: 1
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: dimensions.width * 0.9,
        alignSelf: 'center',
      }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedScreen('Home');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.03,
          }}>
          <Image
            source={require('../assets/icons/homeIcon.png')}
            style={{
              width: dimensions.height * 0.028,
              height: dimensions.height * 0.028,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>


        <Text
          style={{
            fontFamily: fontPoppinsRegular,
            textAlign: "center",
            fontSize: dimensions.width * 0.053,
            padding: dimensions.height * 0.01,
            right: dimensions.width * 0.0088,
            alignSelf: 'center',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase'

          }}
        >
          Settings
        </Text>

        <TouchableOpacity
          disabled={true}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.03,
            opacity: 0
          }}>
          <Image
            source={require('../assets/icons/infoIcon.png')}
            style={{
              width: dimensions.height * 0.028,
              height: dimensions.height * 0.028,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: dimensions.height * 0.023,
          borderRadius: dimensions.height * 0.035,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width * 0.9,
          marginTop: dimensions.height * 0.03,
        }}>
        <Text style={{
          color: 'white',
          fontSize: dimensions.width * 0.05,
          fontFamily: fontPoppinsRegular,
          fontWeight: 400,
        }}>Sounds</Text>
        <Switch
          trackColor={{ false: '#948ea0', true: 'rgba(28, 194, 154, 1)' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSoundSwitch}
          value={isSoundEnabled}
        />
      </View>


      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: dimensions.height * 0.023,
          borderRadius: dimensions.height * 0.035,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width * 0.9,
          marginTop: dimensions.height * 0.012,
        }}>
        <Text style={{
          color: 'white',
          fontSize: dimensions.width * 0.05,
          fontFamily: fontPoppinsRegular,
          fontWeight: 400,
        }}>Vibration</Text>
        <Switch
          trackColor={{ false: '#948ea0', true: 'rgba(28, 194, 154, 1)' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleVibrationSwitch}
          value={isVibrationEnabled}
        />
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: dimensions.height * 0.023,
          borderRadius: dimensions.height * 0.035,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width * 0.9,
          marginTop: dimensions.height * 0.012,
        }}>
        <Text style={{
          color: 'white',
          fontSize: dimensions.width * 0.05,
          fontFamily: fontPoppinsRegular,
          fontWeight: 400,
        }}>Music</Text>
        <Switch
          trackColor={{ false: '#948ea0', true: 'rgba(28, 194, 154, 1)' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleMusicSwitch}
          value={isMusicEnabled}
        />
      </View>


      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: dimensions.height * 0.023,
          borderRadius: dimensions.height * 0.035,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width * 0.9,
          marginTop: dimensions.height * 0.012,
        }}>
        <Text style={{
          color: 'white',
          fontSize: dimensions.width * 0.05,
          fontFamily: fontPoppinsRegular,
          fontWeight: 400,
        }}>Notifications</Text>
        <Switch
          trackColor={{ false: '#948ea0', true: 'rgba(28, 194, 154, 1)' }}
          thumbColor={isNotificationEnabled ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleNotificationSwitch}
          value={isNotificationEnabled}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

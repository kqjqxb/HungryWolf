import React, { useEffect, useState, useRef, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




import RulesScreen from './RulesScreen';
import ShopScreen from './ShopScreen';
import LevelsScreen from './LevelsScreen';
import CatchScreen from './CatchScreen';

const fontInter18ptRegular = 'Inter18pt-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [ownedLevels, setOwnedLevels] = useState([1]);
  const [bg, setBg] = useState(require('../assets/images/onboardingWolfImages/onbBg.png'));


  useEffect(() => {
    const loadCompletedLevels = async () => {
      try {
        const storedLevels = await AsyncStorage.getItem('ownedLevels');
        if (storedLevels !== null) {
          setOwnedLevels(JSON.parse(storedLevels));
        } else {
          const initialLevels = [1];
          await AsyncStorage.setItem('ownedLevels', JSON.stringify(initialLevels));
          setOwnedLevels(initialLevels);
        }
      } catch (error) {
        console.error('Failed to load completed levels:', error);
      }
    };

    loadCompletedLevels();
  }, [selectedLevel, selectedScreen]);


  const getBg = (lvl) => {
    switch (lvl) {
      case 1:
        return require('../assets/images/levelsBg/lvl1Bg.png');
      case 2:
        return require('../assets/images/levelsBg/lvl2Bg.png');
      case 3:
        return require('../assets/images/levelsBg/lvl3Bg.png');
      case 4:
        return require('../assets/images/levelsBg/lvl4Bg.png');
      case 5:
        return require('../assets/images/levelsBg/lvl5Bg.png');
      default:
        return require('../assets/images/levelsBg/lvl1Bg.png');
    }
  }

  useEffect(() => {
    console.log('selectedLevel', selectedLevel);
    setBg(getBg(selectedLevel));
  }, [selectedLevel])

  return (
    <ImageBackground
      source={selectedScreen !== 'Game' ? require('../assets/images/onboardingWolfImages/onbBg.png') : bg}
      style={{ flex: 1, alignItems: 'center', width: '100%' }}
      resizeMode="cover"
    >

      {selectedScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
        }}>

          <View style={{
            marginBottom: dimensions.height * 0.05,
          }}>
            <Image
              source={require('../assets/images/wolfLogo.png')}
              style={{
                width: dimensions.height * 0.19,
                height: dimensions.height * 0.19,
                alignSelf: 'center',
                textAlign: 'center'
              }}
              resizeMode="contain"
            />

            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Game');
              }}
              style={{
                backgroundColor: '#94174E',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                paddingVertical: dimensions.height * 0.025,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginTop: dimensions.height * 0.07
              }}
            >
              <Text
                style={{
                  fontFamily: fontInter18ptRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.059,
                  textAlign: 'center',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}>
                Start
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Levels')
              }}
              style={{
                backgroundColor: '#94174E',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                paddingVertical: dimensions.height * 0.025,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginTop: dimensions.height * 0.014
              }}
            >
              <Text
                style={{
                  fontFamily: fontInter18ptRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.059,
                  textAlign: 'center',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}>
                Levels
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Rules')
              }}
              style={{
                backgroundColor: '#94174E',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                paddingVertical: dimensions.height * 0.025,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginTop: dimensions.height * 0.014
              }}
            >
              <Text
                style={{
                  fontFamily: fontInter18ptRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.059,
                  textAlign: 'center',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}>
                rules
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Shop')
              }}
              style={{
                backgroundColor: '#94174E',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                paddingVertical: dimensions.height * 0.025,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginTop: dimensions.height * 0.014
              }}
            >
              <Text
                style={{
                  fontFamily: fontInter18ptRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.059,
                  textAlign: 'center',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}>
                shop
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : selectedScreen === 'Rules' ? (
        <RulesScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Shop' ? (
        <ShopScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen}   />
      ) : selectedScreen === 'Levels' ? (
        <LevelsScreen setSelectedScreen={setSelectedScreen} setSelectedLevel={setSelectedLevel} ownedLevels={ownedLevels}/>
      ) : selectedScreen === 'Game' ? (
        <CatchScreen setSelectedScreen={setSelectedScreen} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
      ) : null}
    </ImageBackground>
  );
};

export default HomeScreen;

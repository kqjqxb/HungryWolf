import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, SafeAreaView } from 'react-native';
import hungryWolfOnboardingData from '../components/hungryWolfOnboardingData';
import { useNavigation } from '@react-navigation/native';

const fontInter18ptRegular = 'Inter18pt-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentWolfSlideIndex, setCurrentWolfSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);




  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentWolfSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextLeonSlide = () => {
    if (currentWolfSlideIndex < hungryWolfOnboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentWolfSlideIndex + 1 });
    } else {
      navigation.navigate('Home');
    }
  };


  const renderWolfItem = ({ item }) => (
    <View style={{
      width: dimensions.width * 0.9,
      flex: 1,
      borderColor: 'white',
      alignItems: 'center',
      borderWidth: dimensions.width * 0.019,
      borderRadius: dimensions.width * 0.05,
      backgroundColor: '#0D0172',
    }} >
      <View style={{
        height: dimensions.height * 0.35,
        padding: dimensions.height * 0.03,
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.width * 0.9,
        alignSelf: 'center',
      }}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={{
            height: '100%',
            width: '91%',
          }}
        />

      </View>


      <Text
        style={{
          fontSize: dimensions.width * 0.077,
          fontFamily: fontInter18ptRegular,
          maxWidth: '91%',
          color: 'white',
          marginTop: 21,
          textAlign: 'center',
          fontWeight: 900,
        }}>
        {item.title}
      </Text>
      <Text
        style={{
          fontFamily: fontInter18ptRegular,
          fontSize: dimensions.width * 0.046,
          top: dimensions.height * 0.025,
          paddingHorizontal: 21,
          color: 'white',
          textAlign: 'center',
          marginTop: 8,
          fontWeight: 700
        }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/images/onboardingWolfImages/onbBg.png')}
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    >
      <SafeAreaView
        style={{ justifyContent: 'space-between', flex: 1, alignItems: 'center', }}
      >


        <View style={{
          display: 'flex',
          backgroundColor: '#0D0172',
          width: dimensions.width * 0.9,
          height: dimensions.height * 0.7,
          borderRadius: dimensions.width * 0.1,
          alignSelf: 'center'
        }}>
          <FlatList
            data={hungryWolfOnboardingData}
            renderItem={renderWolfItem}
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item) => item.id.toString()}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            ref={slidesRef}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (currentWolfSlideIndex === hungryWolfOnboardingData.length - 1) {
              navigation.navigate('Home');
            } else scrollToTheNextLeonSlide();
          }}
          style={{
            backgroundColor: '#94174E',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: 'white',
            paddingVertical: 21,
            paddingHorizontal: 28,
            marginBottom: 40,
            alignSelf: 'center',
            width: dimensions.width * 0.5,
          }}
        >
          <Text
            style={{
              fontFamily: fontInter18ptRegular,
              color: 'white',
              fontSize: dimensions.width * 0.048,
              textAlign: 'center',
              fontWeight: 900,
              textTransform: 'uppercase',
            }}>
            {currentWolfSlideIndex !== 2 ? 'Continue' : 'Start'}
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnboardingScreen;

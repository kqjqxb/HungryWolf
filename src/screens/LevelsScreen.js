import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const fontInter18ptRegular = 'Inter18pt-Regular';

const levelPositions = [
  { x: 0.1, y: 0.1 },
  { x: 0.8, y: 0.2 },
  { x: 0.1, y: 0.5 },
  { x: 0.8, y: 0.7 },
  { x: 0.1, y: 0.9 },
];

const LevelsScreen = ({ setSelectedScreen, setSelectedLevel, ownedLevels, setOwnedLevels }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));


  const handleSelectLevel = async (lvl) => {
    if (ownedLevels.includes(lvl)) {
      setSelectedLevel(lvl);
      setSelectedScreen('Game');
    } else {
      Alert.alert('Prev level not completed', 'You have not completed previous level yet.');
    }
  };

  return (
    <SafeAreaView
      style={{
        width: dimensions.width,
        height: dimensions.height * 0.8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={dimensions.width}
        height={dimensions.height * 0.8}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: dimensions.height * 0.4,

        }}
      >
        {levelPositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = levelPositions[i - 1];
          const dots = [];
          const segments = 8;
          for (let j = 1; j <= segments; j++) {
            dots.push(
              <Circle
                key={`${i}-${j}`}
                cx={
                  dimensions.width *
                  (prev.x + (pos.x - prev.x) * (j / segments))
                }
                cy={
                  (dimensions.height * 0.8) *
                  (prev.y + (pos.y - prev.y) * (j / segments))
                }
                r={7}
                fill="white"
              />
            );
          }
          return dots;
        })}
      </Svg>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: dimensions.width * 0.9,
            marginTop: dimensions.height * 0.05,
            backgroundColor: '#94174E',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: 'white',
            paddingVertical: dimensions.height * 0.01,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedScreen('Home');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: dimensions.height * 0.023,
            }}
          >
            <Image
              source={require('../assets/icons/leftIcon.png')}
              style={{
                width: dimensions.height * 0.031,
                height: dimensions.height * 0.031,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fontInter18ptRegular,
              textAlign: 'center',
              fontSize: dimensions.width * 0.053,
              padding: dimensions.height * 0.01,
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
            }}
          >
            Levels
          </Text>
          <View
            style={{
              width: 50,
              height: 50,
              opacity: 0,
            }}
          />
        </View>

        {levelPositions.map((pos, index) => {
          const leftPos = pos.x * dimensions.width - 30;
          const topPos = pos.y * dimensions.height * 0.8 - 30;

          return (
            <View
              key={`level-${index + 1}`}
              style={{
                position: 'absolute',
                left: leftPos,
                top: topPos,
                marginTop: dimensions.height * 0.16,
                marginLeft: dimensions.width * 0.05,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleSelectLevel(index + 1);
                }}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#94174E',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                  {ownedLevels.includes(index + 1) ? index + 1 : '·'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default LevelsScreen;

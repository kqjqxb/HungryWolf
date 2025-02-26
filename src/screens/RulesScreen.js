import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const fontInter18ptRegular = 'Inter18pt-Regular';

const RulesScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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
        backgroundColor: '#94174E',
        borderRadius: dimensions.width * 0.03,
        borderWidth: dimensions.width * 0.019,
        borderColor: 'white',
        paddingVertical: dimensions.height * 0.01,
        alignSelf: 'center',
        width: dimensions.width * 0.9,
      }}>
        <TouchableOpacity
          onPress={() => {
            // setSelectedScreen('Home');
            goBack();
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: dimensions.height * 0.023,
          }}>
          <Image
            source={require('../assets/icons/leftIcon.png')}
            style={{
              width: dimensions.height * 0.031,
              height: dimensions.height * 0.031,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontInter18ptRegular,
            textAlign: "center",
            fontSize: dimensions.width * 0.053,
            padding: dimensions.height * 0.01,
            right: dimensions.width * 0.005,
            alignSelf: 'center',
            fontWeight: 700,
            color: 'white',
            textTransform: 'uppercase'

          }}
        >
          Rules
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
            source={require('../assets/icons/bagIcon.png')}
            style={{
              width: dimensions.height * 0.028,
              height: dimensions.height * 0.028,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          paddingBottom: dimensions.height * 0.16,
        }}>
          <View style={{
            backgroundColor: '#94174E',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: 'white',
            paddingVertical: dimensions.height * 0.025,
            alignSelf: 'center',
            width: dimensions.width * 0.9,
            marginTop: dimensions.height * 0.014
          }}>
            <Text
              style={{
                fontFamily: fontInter18ptRegular,
                fontSize: dimensions.width * 0.037,
                paddingHorizontal: 21,
                color: 'rgba(255, 255, 255, 1)',
                textAlign: 'left',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
              📜 How to play:{'\n'}{'\n'}

              Control the Wolf by moving it left or right.{'\n'}
              Catch healthy food (meat, fish, fruits) - it gives points.{'\n'}
              Avoid poisonous foods (rotten mushrooms, canned food, spoiled food) - they reduce the life bar.{'\n'}
              If the life bar is empty - you will have to start the level from the beginning.{'\n'}
              Complete all levels, score the maximum number of points and become the champion among hungry wolves!{'\n'}
              🎯 Goal of the game:{'\n'}
              Feed the Wolf and complete all 5 levels, earning as many points as possible!{'\n'}{'\n'}

              🛑 Tips:{'\n'}
              ✔️ Catch food quickly - it falls faster and faster!{'\n'}
              ✔️ Look carefully - poison can be disguised as regular food.{'\n'}
              ✔️ Use bonuses (if available) to make it easier to complete levels.{'\n'}{'\n'}

              Are you ready to become the most agile Wolf in the forest? 🎮🐺
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RulesScreen;

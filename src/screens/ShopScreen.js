import AsyncStorage from '@react-native-async-storage/async-storage';
import { el } from 'date-fns/locale';
import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const fontInter18ptRegular = 'Inter18pt-Regular';


const values = [
  {
    id: 1,
    image: require('../assets/icons/valueIcons/meatIcon.png'),
  },
  {
    id: 2,
    image: require('../assets/icons/valueIcons/sossigeIcon.png'),
  },
  {
    id: 3,
    image: require('../assets/icons/valueIcons/appleIcon.png'),
  },

]


const powers = [
  {
    id: 1,
    image: require('../assets/icons/powersIcons/speedIcon.png'),
    title: 'Wolf Speed',
    description: 'The wolf moves faster.',
    price: 20,
    priceIcon: require('../assets/icons/valueIcons/meatIcon.png'),
  },
  {
    id: 2,
    image: require('../assets/icons/powersIcons/foodFilterIcon.png'),
    title: 'Food filter',
    description: 'Shows poisonous food in red.',
    price: 30,
    priceIcon: require('../assets/icons/valueIcons/sossigeIcon.png'),
  },
  {
    id: 3,
    image: require('../assets/icons/powersIcons/fullLifeIcon.png'),
    title: 'Full life',
    description: 'Restores life percentage to full.',
    price: 30,
    priceIcon: require('../assets/icons/valueIcons/appleIcon.png'),
  },
  {
    id: 4,
    image: require('../assets/icons/powersIcons/wolfSkin.png'),
    title: 'Exclusive look',
    description: '+100 to health.',
    price: 5,
    priceIcon: require('../assets/icons/valueIcons/appleIcon.png'),
  },
]

const ShopScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [ownedMeat, setOwnedMeat] = useState(0);
  const [ownedSossiges, setOwnedSossiges] = useState(0);
  const [ownedApples, setOwnedApples] = useState(0);
  const [ownedPowers, setOwnedPowers] = useState([]);


  useEffect(() => {
    const loadOwnedPowers = async () => {
      try {
        const storedPowers = await AsyncStorage.getItem('ownedPowers');
        if (storedPowers !== null) {
          setOwnedPowers(JSON.parse(storedPowers));
        } else {
          const initialLevels = [];
          await AsyncStorage.setItem('ownedPowers', JSON.stringify(initialLevels));
          setOwnedPowers(initialLevels);
        }
      } catch (error) {
        console.error('Failed to load completed levels:', error);
      }
    };

    loadOwnedPowers();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      const ownedMeat = await AsyncStorage.getItem('ownedMeat');
      const ownedApples = await AsyncStorage.getItem('ownedApples');
      const ownedSossiges = await AsyncStorage.getItem('ownedSossiges');

      setOwnedMeat(Number(ownedMeat) || 0);
      setOwnedApples(Number(ownedApples) || 0);
      setOwnedSossiges(Number(ownedSossiges) || 0);
    };
    loadItems();
  }, []);

  useEffect(() => {
    console.log('ownedPowers:', ownedPowers);
  }, [ownedPowers]);


  const handleBuyPower = async (power) => {
    if (ownedPowers.includes(power.id)) {
      Alert.alert('You already have this power');
      return;
    }

    if (power.id === 1) {
      if (ownedMeat >= power.price) {
        setOwnedMeat(ownedMeat - power.price);
        setOwnedPowers([...ownedPowers, power.id]);
        await AsyncStorage.setItem('ownedMeat', JSON.stringify(ownedMeat - power.price));
        await AsyncStorage.setItem('ownedPowers', JSON.stringify([...ownedPowers, power.id]));
      } else {
        Alert.alert('Not enough meat');
      }
    } else if (power.id === 2) {
      if (ownedSossiges >= power.price) {
        setOwnedSossiges(ownedSossiges - power.price);
        setOwnedPowers([...ownedPowers, power.id]);
        await AsyncStorage.setItem('ownedSossiges', JSON.stringify(ownedSossiges - power.price));
        await AsyncStorage.setItem('ownedPowers', JSON.stringify([...ownedPowers, power.id]));
      } else {
        Alert.alert('Not enough sossiges');
      }
    } else if (power.id === 3) {
      if (ownedApples >= power.price) {
        setOwnedApples(ownedApples - power.price);
        setOwnedPowers([...ownedPowers, power.id]);
        await AsyncStorage.setItem('ownedApples', JSON.stringify(ownedApples - power.price));
        await AsyncStorage.setItem('ownedPowers', JSON.stringify([...ownedPowers, power.id]));
      } else {
        Alert.alert('Not enough apples');
      }
    } else {
      if (ownedApples >= power.price) {
        setOwnedApples(ownedApples - power.price);
        setOwnedPowers([...ownedPowers, power.id]);
        await AsyncStorage.setItem('ownedApples', JSON.stringify(ownedApples - power.price));
        await AsyncStorage.setItem('ownedPowers', JSON.stringify([...ownedPowers, power.id]));
      } else {
        Alert.alert('Not enough apples');
      }
    }

  }

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
            setSelectedScreen('Home');
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
          Shop
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


      <View style={{
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.88,
        alignItems: 'center',
        marginTop: dimensions.height * 0.03,
      }}>
        {values.map((item) => (
          <View key={item.id} style={{
            backgroundColor: 'white',
            height: dimensions.width * 0.23,
            width: dimensions.width * 0.23,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: '#0D0172',
            padding: dimensions.width * 0.01,
            justifyContent: 'center',
          }}>
            <Image
              resizeMode="contain"
              source={item.image}
              style={{
                height: dimensions.height * 0.04,
                width: dimensions.height * 0.04,

              }}
            />


            <Text
              style={{
                fontFamily: fontInter18ptRegular,
                textAlign: "center",
                fontSize: dimensions.width * 0.05,
                padding: dimensions.height * 0.01,
                right: dimensions.width * 0.005,
                alignSelf: 'center',
                fontWeight: 700,
                color: '#0D0172',
                textTransform: 'uppercase'

              }}
            >
              {item.id === 1 ? ownedMeat : item.id === 2 ? ownedSossiges : ownedApples}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          marginTop: dimensions.height * 0.03,
          paddingBottom: dimensions.height * 0.16,
        }}>
          {powers.map((power) => (
            <View key={power.id} style={{
              backgroundColor: '#94174E',
              borderRadius: dimensions.width * 0.03,
              borderWidth: dimensions.width * 0.019,
              borderColor: 'white',
              paddingVertical: dimensions.height * 0.016,
              alignSelf: 'center',
              width: dimensions.width * 0.9,
              marginTop: dimensions.height * 0.014,
              paddingHorizontal: dimensions.width * 0.034,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
                <View style={{
                  backgroundColor: power.id < 4 ? '#FFFE04' : 'transparent',
                  borderRadius: dimensions.width * 0.03,
                  borderWidth: power.id < 4 ? dimensions.width * 0.019 : 0,
                  borderColor: '#0D0172',
                  padding: dimensions.width * 0.037
                }}>
                  <Image
                    resizeMode="contain"
                    source={power.image}
                    style={{
                      height: power.id < 4 ? dimensions.width * 0.088 : dimensions.height * 0.1,
                      width: power.id < 4 ? dimensions.width * 0.088 : dimensions.height * 0.1,
                    }}
                  />
                </View>

                <View style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: dimensions.width * 0.037,
                  width: dimensions.width * 0.6
                }}>
                  <Text
                    style={{
                      fontSize: dimensions.width * 0.059,
                      fontFamily: fontInter18ptRegular,
                      color: 'white',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}>
                    {power.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontInter18ptRegular,
                      fontSize: dimensions.width * 0.04,
                      color: 'white',
                      textAlign: 'left',
                      fontWeight: 600
                    }}>
                    {power.description}
                  </Text>
                </View>
              </View>


              <TouchableOpacity
                disabled={ownedPowers.includes(power.id)}
                onPress={() => {
                  handleBuyPower(power);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.03,
                  borderWidth: dimensions.width * 0.019,
                  borderColor: '#0D0172',
                  paddingVertical: dimensions.height * 0.019,
                  marginTop: dimensions.height * 0.019,
                  alignSelf: 'center',
                  width: dimensions.width * 0.8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{
                    fontFamily: fontInter18ptRegular,
                    color: '#0D0172',
                    fontSize: dimensions.width * 0.048,
                    textAlign: 'center',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}>
                  {ownedPowers.includes(power.id) ? 'Received' : `Get it for ${power.price}`}
                </Text>
                {!ownedPowers.includes(power.id) && (
                  <Image
                    resizeMode="contain"
                    source={power.priceIcon}
                    style={{
                      height: dimensions.height * 0.03,
                      width: dimensions.height * 0.03,
                      marginLeft: dimensions.width * 0.01
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>

          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  Modal,
  ImageBackground,
} from 'react-native';

const fontInter18ptRegular = 'Inter18pt-Regular';
const fontInter18ptBold = 'Inter18pt-Bold';

const values = [
  { id: 1, image: require('../assets/icons/valueIcons/appleIcon.png') },
  { id: 2, image: require('../assets/icons/valueIcons/meatIcon.png') },
  { id: 3, image: require('../assets/icons/valueIcons/sossigeIcon.png') },
];

const food = [
  {
    id: 1,
    image: require('../assets/icons/valueIcons/appleIcon.png'),
    isPositive: true,
    type: 'apple',
  },
  {
    id: 2,
    image: require('../assets/icons/valueIcons/meatIcon.png'),
    isPositive: true,
    type: 'meat',
  },
  {
    id: 3,
    image: require('../assets/icons/valueIcons/sossigeIcon.png'),
    isPositive: true,
    type: 'sossige',
  },
  {
    id: 4,
    image: require('../assets/icons/valueIcons/cupIcon.png'),
    isPositive: false,
    markedImage: require('../assets/icons/valueIcons/markedIcons/markedCup.png'),
  },
  {
    id: 5,
    image: require('../assets/icons/valueIcons/mushroomIcon.png'),
    isPositive: false,
    markedImage: require('../assets/icons/valueIcons/markedIcons/markedMashroom.png'),
  },
  {
    id: 6,
    image: require('../assets/icons/valueIcons/bagIcon.png'),
    isPositive: false,
    markedImage: require('../assets/icons/valueIcons/markedIcons/murkedBag.png'),
  },
];

const CatchScreen = ({ setSelectedScreen, selectedLevel, setSelectedLevel }) => {
  const [dimensions] = useState(Dimensions.get('window'));

  const [meatAmount, setMeatAmount] = useState(0);
  const [applesAmount, setApplesAmount] = useState(0);
  const [sossigesAmount, setSossigesAmount] = useState(0);
  const [health, setHealth] = useState(100);

  const [timeRemaining, setTimeRemaining] = useState(70);

  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [restartTimer, setRestartTimer] = useState(0);
  const [result, setResult] = useState('');
  const [ownedPowers, setOwnedPowers] = useState([]);
  const [isFullHpAvailable, setIsFullHpAvailable] = useState(true);


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

  const [wolfX] = useState(new Animated.Value(0));

  const [fallingFood, setFallingFood] = useState([]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const wolfWidth = dimensions.height * 0.16;
        let newX = wolfX._value;

        if (gestureState.dx < -50) {
          // left
          newX = Math.max(0 - dimensions.width * 0.4, wolfX._value - dimensions.width * 0.2);
        } else if (gestureState.dx > 50) {
          // right swipe
          newX = Math.min(dimensions.width * 0.8 - wolfWidth, wolfX._value + dimensions.width * 0.2);
        }

        Animated.spring(wolfX, {
          toValue: newX,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const tryCollision = (item) => {
    const wolfWidth = dimensions.height * 0.16; 
    const margin = 0; 
    const wolfLeft = wolfX._value - margin;
    const wolfRight = wolfX._value + wolfWidth + margin;
    const itemCenter = item.x - dimensions.width * 0.25; 
    return itemCenter >= wolfLeft && itemCenter <= wolfRight;
  };

  const lastFoodRef = useRef(null);

  const spawnFood = () => {
    let randItem = food[Math.floor(Math.random() * food.length)];
    let safety = 10; 
    while (lastFoodRef.current && lastFoodRef.current.type === randItem.type && safety > 0) {
      randItem = food[Math.floor(Math.random() * food.length)];
      safety--;
    }
    lastFoodRef.current = randItem; 

    const randX = Math.random() * (dimensions.width - 40);

    const newItem = {
      id: Date.now(),
      x: randX,
      y: new Animated.Value(-50),
      caught: false,
      ...randItem,
    };

    setFallingFood((prev) => [...prev, newItem]);

    const collisionThresholdY = dimensions.height * 0.7;

    const listenerId = newItem.y.addListener(({ value }) => {
      if (!newItem.caught && value >= collisionThresholdY) {
        if (tryCollision(newItem)) {
          newItem.caught = true;
          setTimeout(() => {
            if (newItem.isPositive) {
              if (newItem.type === 'apple') setApplesAmount((prev) => prev + 1);
              else if (newItem.type === 'meat') setMeatAmount((prev) => prev + 1);
              else if (newItem.type === 'sossige') setSossigesAmount((prev) => prev + 1);
            } else {
              setHealth((prev) => Math.max(prev - 10, 0));
            }
            setFallingFood((prev) => prev.filter((f) => f.id !== newItem.id));
          }, 0);
          newItem.y.removeListener(listenerId);
        }
      }
    });

    Animated.timing(newItem.y, {
      toValue: dimensions.height + 50,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      newItem.y.removeListener(listenerId);
      setTimeout(() => {
        setFallingFood((prev) => prev.filter((f) => f.id !== newItem.id));
      }, 0);
    });
  };


  useEffect(() => {
    if (health > 0) {
      setResult('Win')
    }
  }, [resultsModalVisible]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval);
          setResultsModalVisible(true);
          return 0;
        }
        return pauseModalVisible ? prev : prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [restartTimer, pauseModalVisible]);


  useEffect(() => {
    let timerId = null;
    if (!pauseModalVisible && !resultsModalVisible) {
      timerId = setInterval(() => {
        if (!pauseModalVisible && !resultsModalVisible) {
          spawnFood();
        }
      }, 1900);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [pauseModalVisible, resultsModalVisible]);

  useEffect(() => {
    const updateOwnedLevels = async () => {
      if (health > 0) {
        if (selectedLevel < 5) {
          try {
            const storedLevels = await AsyncStorage.getItem('ownedLevels');
            let ownedLevels = storedLevels ? JSON.parse(storedLevels) : [];

            if (!ownedLevels.includes(selectedLevel + 1)) {
              ownedLevels.push(selectedLevel + 1);
              await AsyncStorage.setItem('ownedLevels', JSON.stringify(ownedLevels));
            }
          } catch (error) {
            console.error('Failed to update owned levels:', error);
          }
        }
      }
    };

    updateOwnedLevels();
  }, [resultsModalVisible, selectedLevel]);

  useEffect(() => {
    if (health <= 0) {
      setResult('Lose');
      setResultsModalVisible(true);
    }
  }, [health])

  const handleSaveResults = async () => {
    const ownedMeat = await AsyncStorage.getItem('ownedMeat');
    const ownedApples = await AsyncStorage.getItem('ownedApples');
    const ownedSossiges = await AsyncStorage.getItem('ownedSossiges');

    const newMeat = ownedMeat ? parseInt(ownedMeat) + meatAmount : meatAmount;
    const newApples = ownedApples ? parseInt(ownedApples) + applesAmount : applesAmount;
    const newSossiges = ownedSossiges ? parseInt(ownedSossiges) + sossigesAmount : sossigesAmount;

    await AsyncStorage.setItem('ownedMeat', newMeat.toString());
    await AsyncStorage.setItem('ownedApples', newApples.toString());
    await AsyncStorage.setItem('ownedSossiges', newSossiges.toString());
  }

  useEffect(() => {
    if (resultsModalVisible) {
      handleSaveResults();
      setIsFullHpAvailable(true);
    }
  }, [resultsModalVisible])


  useEffect(() => {
    console.log('ownedPowers:', ownedPowers);
  }, [ownedPowers]);

  return (
    <SafeAreaView
      style={{
        width: dimensions.width,
        height: dimensions.height,
        alignSelf: 'center',
        alignItems: 'center',
      }}
      {...panResponder.panHandlers}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: dimensions.width * 0.95,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setPauseModalVisible(true);

          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: dimensions.height * 0.023,
            width: dimensions.width * 0.19,
            height: dimensions.width * 0.19,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: '#94174E',
            paddingVertical: dimensions.height * 0.01,
          }}
        >
          <Image
            source={require('../assets/icons/pauseIcon.png')}
            style={{
              width: dimensions.height * 0.031,
              height: dimensions.height * 0.031,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View
          style={{
            maxWidth: dimensions.width * 0.5,
            flex: 1,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.03,
            borderWidth: dimensions.width * 0.019,
            borderColor: '#94174E',
            paddingVertical: dimensions.height * 0.01,
          }}
        >
          <Text
            style={{
              fontFamily: fontInter18ptRegular,
              textAlign: 'center',
              fontSize: dimensions.width * 0.053,
              padding: dimensions.height * 0.01,
              fontWeight: '700',
              color: '#0D0172',
              textTransform: 'uppercase',
            }}
          >
            TIME: {timeRemaining} sec
          </Text>
        </View>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          {values.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: '#94174E',
                width: dimensions.width * 0.21,
                height: dimensions.width * 0.21,
                marginBottom: dimensions.height * 0.01,
                paddingHorizontal: dimensions.width * 0.01,
              }}
            >
              <Image
                resizeMode="contain"
                source={item.image}
                style={{
                  height: dimensions.height * 0.037,
                  width: dimensions.height * 0.037,
                }}
              />
              <Text
                style={{
                  fontFamily: fontInter18ptRegular,
                  textAlign: 'center',
                  fontSize: dimensions.width * 0.043,
                  padding: dimensions.height * 0.005,
                  alignSelf: 'center',
                  fontWeight: 700,
                  color: '#94174E',
                  textTransform: 'uppercase',
                }}
              >
                {item.id === 1
                  ? applesAmount
                  : item.id === 2
                    ? meatAmount
                    : sossigesAmount}
              </Text>
            </View>
          ))}
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.03,
              borderWidth: dimensions.width * 0.019,
              borderColor: '#94174E',
              width: dimensions.width * 0.21,
              height: dimensions.height * 0.21,
              overflow: 'hidden', 
            }}
          >
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: `${health}%`, 
                backgroundColor: health >= 66 ? '#197F19' : health >= 33 && health < 66 ? '#EDC214' : '#ED2614', // Color of the health bar
              }}
            />
            <Text
              style={{
                fontFamily: fontInter18ptRegular,
                textAlign: 'center',
                fontSize: dimensions.width * 0.055,
                padding: dimensions.height * 0.005,
                alignSelf: 'center',
                fontWeight: '700',
                color: health >= 55 ? 'white' : 'black',
                textTransform: 'uppercase',
              }}
            >
              {health}
            </Text>
          </View>
          {ownedPowers.includes(3) && isFullHpAvailable  && (
            <TouchableOpacity
              onPress={() => {
                setHealth(100);
                setIsFullHpAvailable(false);
              }}
              style={{
                backgroundColor: '#FFFE04',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.019,
                borderColor: '#0D0172',
                width: dimensions.width * 0.21,
                height: dimensions.width * 0.21,
                marginBottom: dimensions.height * 0.01,
                paddingHorizontal: dimensions.width * 0.01,
                justifyContent: 'center',
                marginTop: dimensions.height * 0.01,
              }}
            >
              <Image
                resizeMode="contain"
                source={require('../assets/icons/powersIcons/fullLifeIcon.png')}
                style={{
                  height: dimensions.height * 0.037,
                  width: dimensions.height * 0.037,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {fallingFood.map((item) => (
        <Animated.View
          key={item.id}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
          }}
        >
          <Image
            source={item.id > 3 && ownedPowers.includes(2) ? item.markedImage : item.image}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
        </Animated.View>
      ))}

      <Animated.View
        style={{
          position: 'absolute',
          bottom: dimensions.height * 0.05,
          transform: [{ translateX: wolfX }],
        }}
      >
        <Image
          resizeMode="contain"
          source={ownedPowers.includes(4) ? require('../assets/images/wolfSkins/silverWolf.png') : require('../assets/images/wolfSkins/simpleWolf.png')}
          style={{
            height: dimensions.height * 0.16,
            width: dimensions.height * 0.16,
          }}
        />
      </Animated.View>



      <Modal
        animationType="fade"
        transparent={true}
        visible={pauseModalVisible}
        onRequestClose={() => {
          setPauseModalVisible(false);
        }}
      >
        <ImageBackground source={require('../assets/images/onboardingWolfImages/onbBg.png')} style={{ flex: 1, width: dimensions.width, height: dimensions.height }}>

          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <SafeAreaView style={{
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: dimensions.height * 0.07,
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

              <View style={{
                width: dimensions.width * 0.9,
                backgroundColor: '#0D0172',
                borderRadius: dimensions.width * 0.05,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: dimensions.height * 0.05,
              }}>


                <Text
                  style={{
                    fontFamily: fontInter18ptBold,
                    color: 'white',
                    fontSize: dimensions.width * 0.1,
                    textAlign: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                  Pause
                </Text>

                <View style={{
                  marginTop: dimensions.height * 0.05,
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPauseModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#94174E',
                      borderRadius: dimensions.width * 0.037,
                      borderWidth: dimensions.width * 0.019,
                      borderColor: 'white',
                      paddingVertical: dimensions.height * 0.016,
                      alignSelf: 'center',
                      width: dimensions.width * 0.75,

                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontInter18ptRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}>
                      Continue
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedScreen('Game');
                    }}
                    style={{
                      backgroundColor: '#94174E',
                      borderRadius: dimensions.width * 0.037,
                      borderWidth: dimensions.width * 0.019,
                      borderColor: 'white',
                      paddingVertical: dimensions.height * 0.016,
                      alignSelf: 'center',
                      width: dimensions.width * 0.75,
                      marginTop: dimensions.height * 0.019
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontInter18ptRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}>
                      Restart level
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => {
                      setSelectedScreen('Home');
                    }}
                    style={{
                      backgroundColor: '#94174E',
                      borderRadius: dimensions.width * 0.037,
                      borderWidth: dimensions.width * 0.019,
                      borderColor: 'white',
                      paddingVertical: dimensions.height * 0.016,
                      alignSelf: 'center',
                      width: dimensions.width * 0.75,
                      marginTop: dimensions.height * 0.019
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontInter18ptRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}>
                      Exit to menu
                    </Text>
                  </TouchableOpacity>

                </View>


              </View>
            </SafeAreaView>
          </SafeAreaView>
        </ImageBackground>
      </Modal>


      <Modal
        animationType="fade"
        transparent={true}
        visible={resultsModalVisible}
        onRequestClose={() => {
          setResultsModalVisible(false);
        }}
      >
        <ImageBackground source={require('../assets/images/onboardingWolfImages/onbBg.png')} style={{ flex: 1, width: dimensions.width, height: dimensions.height }}>

          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <SafeAreaView style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
              <View style={{
                width: dimensions.width * 0.9,
                backgroundColor: '#0D0172',
                borderRadius: dimensions.width * 0.05,
                borderWidth: dimensions.width * 0.019,
                borderColor: 'white',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: dimensions.height * 0.05,
              }}>


                <Image
                  source={result === 'Win'
                    ? require('../assets/images/winWolfImage.png')
                    : require('../assets/images/wolfSkins/simpleWolf.png')
                  }
                  style={{
                    width: dimensions.height * 0.14,
                    height: dimensions.height * 0.14,
                    alignSelf: 'center',
                    textAlign: 'center'
                  }}
                  resizeMode="contain"
                />


                <Text
                  style={{
                    fontFamily: fontInter18ptBold,
                    color: 'white',
                    fontSize: dimensions.width * 0.064,
                    textAlign: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginTop: dimensions.height * 0.016
                  }}>
                  Level {selectedLevel} {result === 'Win' ? '' : 'not'} passed
                </Text>
                <Text
                  style={{
                    fontFamily: fontInter18ptRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.04,
                    textAlign: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginTop: dimensions.height * 0.012
                  }}>
                  {result === 'Win' ? 'Time is up, the wolf is full!' : 'The wolf is poisoned'}
                </Text>
                <Text
                  style={{
                    fontFamily: fontInter18ptRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.05,
                    textAlign: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginTop: dimensions.height * 0.016
                  }}>
                  Caught food:
                </Text>


                <View style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: dimensions.height * 0.03,
                }}>
                  {values.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: dimensions.width * 0.03,
                        borderWidth: dimensions.width * 0.019,
                        borderColor: '#94174E',
                        width: dimensions.width * 0.21,
                        height: dimensions.width * 0.21,
                        marginBottom: dimensions.height * 0.01,
                        paddingHorizontal: dimensions.width * 0.01,
                        marginHorizontal: item.id === 2 ? dimensions.width * 0.04 : 0,
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        source={item.image}
                        style={{
                          height: dimensions.height * 0.037,
                          width: dimensions.height * 0.037,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fontInter18ptRegular,
                          textAlign: 'center',
                          fontSize: dimensions.width * 0.043,
                          padding: dimensions.height * 0.005,
                          alignSelf: 'center',
                          fontWeight: 700,
                          color: '#94174E',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.id === 1
                          ? applesAmount
                          : item.id === 2
                            ? meatAmount
                            : sossigesAmount}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={{
                  marginTop: dimensions.height * 0.05,
                }}>
                  {result === 'Win' && (

                    <TouchableOpacity
                      onPress={() => {
                        setResultsModalVisible(false);
                        setTimeRemaining(70);
                        setMeatAmount(0);
                        setApplesAmount(0);
                        setSossigesAmount(0);
                        setHealth(100);
                        setRestartTimer(prev => prev + 1);
                        if (selectedLevel < 5)
                          setSelectedLevel(selectedLevel + 1);
                        else setSelectedLevel(1);
                      }}
                      style={{
                        backgroundColor: '#94174E',
                        borderRadius: dimensions.width * 0.037,
                        borderWidth: dimensions.width * 0.019,
                        borderColor: 'white',
                        paddingVertical: dimensions.height * 0.016,
                        alignSelf: 'center',
                        width: dimensions.width * 0.75,

                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontInter18ptRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.05,
                          textAlign: 'center',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                        }}>
                        NEXT LEVEL
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setTimeRemaining(70);
                      setMeatAmount(0);
                      setApplesAmount(0);
                      setSossigesAmount(0);
                      setHealth(100);
                      setResultsModalVisible(false);
                      setRestartTimer(prev => prev + 1);
                    }}
                    style={{
                      backgroundColor: '#94174E',
                      borderRadius: dimensions.width * 0.037,
                      borderWidth: dimensions.width * 0.019,
                      borderColor: 'white',
                      paddingVertical: dimensions.height * 0.016,
                      alignSelf: 'center',
                      width: dimensions.width * 0.75,
                      marginTop: dimensions.height * 0.019
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontInter18ptRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}>
                      Restart level
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => {
                      setSelectedScreen('Home');
                    }}
                    style={{
                      backgroundColor: '#94174E',
                      borderRadius: dimensions.width * 0.037,
                      borderWidth: dimensions.width * 0.019,
                      borderColor: 'white',
                      paddingVertical: dimensions.height * 0.016,
                      alignSelf: 'center',
                      width: dimensions.width * 0.75,
                      marginTop: dimensions.height * 0.019
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontInter18ptRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}>
                      Exit to menu
                    </Text>
                  </TouchableOpacity>

                </View>


              </View>
            </SafeAreaView>
          </SafeAreaView>
        </ImageBackground>
      </Modal>
    </SafeAreaView>
  );
};

export default CatchScreen;

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity, Linking } from 'react-native';

const HomeScreen = (props) => {
  const [bgAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));
  const [tosLinkAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(0));

    const handleContinue = ({navigation}) => {
        //Todo: Send user's agreement to server and store in database
        //Todo: Check if user has already agreed to terms of service
        props.navigation.navigate('Home');
    };

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tosLinkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [iconAnim, textAnim, tosLinkAnim, buttonAnim]);

  const tosLinkOpacity = tosLinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const buttonOpacity = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={roninIcon}
        style={[
          styles.icon,
          {
            opacity: iconAnim,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textAnim,
          },
        ]}
      >
        Welcome To Ronin
      </Animated.Text>
      <Animated.Text
        style={[
          styles.tosLink,
          {
            opacity: tosLinkOpacity,
          },
        ]}
        onPress={() => Linking.openURL('https://www.google.com/')}
      >
        Terms of Service
      </Animated.Text>
      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Agree & Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const roninIcon = require('../assets/ronin.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  tosLink: {
    fontSize: 16,
    color: '#2e78b7',
    textDecorationLine: 'underline',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default HomeScreen;
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
    <Image source={roninIcon} style={styles.icon} />
        <Text style={styles.title}>Ronin</Text>
    </View>
  );
}

const roninIcon = require('../assets/ronin.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
});

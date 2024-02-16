import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  View
} from 'react-native';

import { setAthleteId } from '../reducers/athleteSlice';

import { useDispatch } from 'react-redux';

const LoginScreen = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter your username and password.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/v1/athlete/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 401) {
        // Handle unauthorized access
        Alert.alert('Error', 'Invalid username or password.');
        return;
      } else if (!response.ok) {
        // Handle other errors based on status code or throw a generic error
        throw new Error('Something went wrong with the login process.');
      }
  
      const data = await response.json(); // Correctly call the json() method
      console.log('data, ', data);
      // Now that data is correctly parsed, check its value
      if (data === false) {
        Alert.alert('Error', 'Invalid username or password. Sign Up Below');
      } else {
        dispatch(setAthleteId(data));
        props.navigation.navigate('Home', { initialRoute: 'Challenge' });
      }
    } catch (error) {
      console.log('Error logging in:', error);
      Alert.alert('Login Error', 'There was a problem logging in. Please try again later.');
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('Registration')}>
        <Text style={styles.signupLink}>Sign Up Here</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupLink: {
    color: '#1e90ff',
    textAlign: 'center',
  },
});

export default LoginScreen;

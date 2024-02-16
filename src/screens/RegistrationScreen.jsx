import React, { useState, useEffect } from 'react';
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

import { useSelector, useDispatch } from 'react-redux';

const RegistrationScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const gyms = useSelector((state) => state.gyms);
  const dispatch = useDispatch();

  const isValidEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const isValidDateOfBirth = (dob) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    return dateRegex.test(dob);
  };

  const isUsernameAvailable = async (username) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/athlete/all/usernames', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data == null) {
        return true;
        }
      for (let i = 0; i < data.length; i++) {
        if (data[i] === username) {
          return false; // The username is already taken
        }
      }
  
      return true; // The username is available
    } catch (error) {
      console.log('Error checking username availability:', error);
      return false;
    }
  };

  const handleRegister = async ({ navigation }) => {
    if (!firstName || !lastName || !email || !username || !password || !birthDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }

    if (!isValidDateOfBirth(birthDate)) {
      Alert.alert('Error', 'Invalid date format. Please use MM/dd/YYYY.');
      return;
    }

    const usernameAvailable = await isUsernameAvailable(username);
    if (!usernameAvailable) {
      Alert.alert('Error', 'Username is already taken.');
      return;
    }

    const athlete = {
      firstName,
      lastName,
      email,
      username,
      password,
      birthDate,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/athlete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(athlete),
      });

      const data = await response.json();
      console.log('athlete id after registration: ', data)
      dispatch(setAthleteId(data));
      props.navigation.navigate('StyleSelector');
    } catch (error) {
      console.log('Error creating athlete:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
        />
          <TextInput
    style={styles.input}
    placeholder="Email"
    onChangeText={(text) => setEmail(text)}
    value={email}
    keyboardType="email-address"
    autoCapitalize="none"
  />

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

  <TextInput
    style={styles.input}
    placeholder="Birth Date"
    onChangeText={(text) => setBirthDate(text)}
    value={birthDate}
  />

  <TouchableOpacity style={styles.button} onPress={handleRegister}>
    <Text style={styles.buttonText}>Register</Text>
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
});

export default RegistrationScreen;

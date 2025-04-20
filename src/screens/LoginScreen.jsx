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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../config/api";

const LoginScreen = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/athlete/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", JSON.stringify(data, null, 2));

      if (response.ok) {
        // The backend sends athleteId (lowercase a)
        const athleteId = data.athleteId;
        console.log("Login successful, athlete ID:", athleteId);

        if (!athleteId) {
          console.error("No athlete ID in response:", data);
          Alert.alert("Error", "Invalid response from server");
          return;
        }

        // Store the athlete data in Redux
        console.log("Storing in Redux:", athleteId);
        // Just store the ID directly instead of the whole object
        dispatch(setAthleteId(athleteId));

        // Store just the ID in AsyncStorage
        await AsyncStorage.setItem("athleteId", athleteId.toString());

        props.navigation.navigate("Home", { initialRoute: 'Challenge' });
      } else {
        console.error("Login failed with status:", response.status);
        console.error("Error response:", data);
        Alert.alert("Error", data.error || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response data'
      });
      Alert.alert(
        "Error",
        "Could not connect to the server. Please check your internet connection and try again."
      );
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

      <View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text>{showPassword ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>

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
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  }
});

export default LoginScreen;

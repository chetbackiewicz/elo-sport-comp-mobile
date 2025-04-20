// MyProfileScreen.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { setAthleteId } from '../reducers/athleteSlice';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from "../config/api";

const placeholderImage = require('../assets/Placeholder.png');

const MyProfileScreen = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [styleMap, setStyleMap] = useState({});

  const dispatch = useDispatch();

  const athleteId = useSelector((state) => state.athlete.athleteId);

  const handleLogout = () => {
    dispatch(setAthleteId(null));
    props.navigation.navigate('Login');
  };

  const fetchStyles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/styles`);
      console.log('Styles response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status fetching styles: ${response.status}`);
      }
      const stylesJson = await response.json();

      const stylesMap = {};
      stylesJson.forEach(style => {
        stylesMap[style.styleId] = style.name;
      });
      setStyleMap(stylesMap);
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          if (!athleteId) {
            console.log('No athlete ID found');
            return;
          }

          await fetchStyles();

          const actualId = typeof athleteId === 'object' ? athleteId.athleteId : athleteId;
          console.log('Fetching profile data for athlete ID:', actualId);

          // Profile fetch
          const profileResponse = await fetch(`${API_BASE_URL}/api/v1/athlete/${actualId}`);
          console.log('Profile response status:', profileResponse.status);
          if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status fetching profile: ${profileResponse.status}`);
          }
          const profileJson = await profileResponse.json();
          console.log('Profile data received:', JSON.stringify(profileJson, null, 2));

          // Record fetch
          const recordResponse = await fetch(`${API_BASE_URL}/api/v1/athlete/${actualId}/record`);
          console.log('Record response status:', recordResponse.status);
          if (!recordResponse.ok) {
            throw new Error(`HTTP error! Status fetching record: ${recordResponse.status}`);
          }
          const recordJson = await recordResponse.json();
          console.log('Record data received:', JSON.stringify(recordJson, null, 2));

          // Score fetch
          const scoreResponse = await fetch(`${API_BASE_URL}/api/v1/score/${actualId}`);
          console.log('Score response status:', scoreResponse.status);
          if (!scoreResponse.ok) {
            throw new Error(`HTTP error! Status fetching scores: ${scoreResponse.status}`);
          }
          const scoreJson = await scoreResponse.json();
          console.log('Score data received:', JSON.stringify(scoreJson, null, 2));

          if (scoreJson == null) {
            console.log('No score data received, setting empty array');
            setScoreData([]);
          } else {
            console.log('Setting score data:', JSON.stringify(scoreJson, null, 2));
            setScoreData(scoreJson);
          }

          console.log('Setting profile data:', JSON.stringify(profileJson, null, 2));
          setProfileData(profileJson);
          console.log('Setting record data:', JSON.stringify(recordJson, null, 2));
          setRecordData(recordJson);
        } catch (error) {
          console.error('Error fetching data:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
              status: error.response.status,
              data: error.response.data
            } : 'No response data'
          });
        }
      };

      fetchData();

      // Cleanup function
      return () => {
        console.log('Profile screen cleanup');
      };
    }, [athleteId])
  );

  if (!profileData || !recordData || !scoreData) {

    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const {
    firstName,
    lastName,
    username,
    birthDate,
    email,
    password,
  } = profileData;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Profile picture */}
        <Image
          style={styles.profileImage}
          source={placeholderImage}
        />
        <Text style={styles.userName}>{username}</Text>

        {/* Ratings */}
        <Text style={styles.ratingTitle}>Ratings</Text>
        <View style={styles.ratingContainer}>
          {scoreData && scoreData.length > 0 ? (
            scoreData.map((item, index) => {
              const styleName = styleMap[item.styleId] || 'Unknown Style';
              return (
                <View style={styles.ratingRow} key={`${styleName}-${index}`}>
                  <Text style={styles.styleName}>{styleName}</Text>
                  <Text style={styles.score}>{item.score}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noScores}>No ratings available</Text>
          )}
        </View>

        {/* User information */}
        <Text style={styles.userInfoTitle}>Account Info</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Name </Text>
            <Text style={styles.userInfoItem}>{firstName} {lastName}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Username </Text>
            <Text style={styles.userInfoItem}>{username}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Email </Text>
            <Text style={styles.userInfoItem}>{email}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Password </Text>
            <Text style={styles.userInfoItem}>********</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Birthday </Text>
            <Text style={styles.userInfoItem}>{new Date(birthDate).toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileImage: {
        width: '35%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 100,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    winLoss: {
        fontSize: 18,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center',
    },
    ratingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 15,
        alignSelf: 'center',
        textAlign: 'center',
    },
    ratingContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
      },
      ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: '5%',
        marginBottom: 10,
      },
      styleName: {
        flex: 1,
        fontStyle: 'italic',
        textAlign: 'center', 
      },
      score: {
        flex: 1,
        textAlign: 'center',
      },
      userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 55,
        alignSelf: 'center',
        textAlign: 'center',
    },
    userInfoContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
      },
      userInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: '5%',
        marginBottom: 10,
      },
    userInfoLabel: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 11,
    },
    userInfoItem: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 11,
    },
    logoutButton: {
      backgroundColor: "#fff",
      borderColor: "#000",
      borderRadius: 5,
      borderWidth: 2,
      padding: 10,
      marginBottom: 50,
      marginTop: 50,
      alignSelf: "center",
      width: "80%",
      fontSize: 18,
    },
    logoutButtonText: {
      color: "#000",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      paddingTop: 5,
    },
    noScores: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#666',
      marginTop: 10,
    },
});

export default MyProfileScreen;

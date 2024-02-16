// MyProfileScreen.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { setAthleteId } from '../reducers/athleteSlice';
import { useDispatch } from 'react-redux';

const MyProfileScreen = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const dispatch = useDispatch();

  const athleteId = useSelector((state) => state.athlete.athleteId);

  const handleLogout = () => {
    dispatch(setAthleteId(null));
    props.navigation.navigate('Login');
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const profileResponse = await fetch(`http://localhost:8000/api/v1/athlete/${athleteId.athleteId}`);
          if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status fetching profile: ${profileResponse.status}`);
          }
          const recordResponse = await fetch(`http://localhost:8000/api/v1/athlete/${athleteId.athleteId}/record`);
          if (!recordResponse.ok) {
            throw new Error(`HTTP error! Status fetching record: ${recordResponse.status}`);
          }
          const scoreResponse = await fetch(`http://localhost:8000/api/v1/score/${athleteId.athleteId}`);
          if (!recordResponse.ok) {
            throw new Error(`HTTP error! Status fetching record: ${recordResponse.status}`);
          }

          const profileJson = await profileResponse.json();
          const recordJson = await recordResponse.json();
          const scoreJson = await scoreResponse.json();
          console.log('some data ', profileData, recordJson, scoreJson)
          if (scoreJson == null) {
              setScoreData([]);
          } else {
              setScoreData(scoreJson);
          }
          setProfileData(profileJson);
          setRecordData(recordJson);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      };

      fetchData();

      // Cleanup function
      return () => {};
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

  const { wins, losses, draws } = recordData;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Profile picture */}
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
            <Text style={styles.userName}>{username}</Text>

        {/* Wins and Losses */}
        <View style={styles.winLossContainer}>
          <View style={styles.winLossItem}>
            <Text style={styles.winLossTitle}>Wins</Text>
            <Text style={styles.winLoss}>{wins}</Text>
          </View>
          <View style={styles.winLossItem}>
            <Text style={styles.winLossTitle}>Draws</Text>
            <Text style={styles.winLoss}>{draws}</Text>
          </View>
          <View style={styles.winLossItem}>
            <Text style={styles.winLossTitle}>Losses</Text>
            <Text style={styles.winLoss}>{losses}</Text>
          </View>
        </View>

        {/* Ratings */}
        <Text style={styles.ratingTitle}>Ratings</Text>
        <View style={styles.ratingContainer}>
        {scoreData.map((item) => (
            <View style={styles.ratingRow} key={item.styleName}>
            <Text style={styles.styleName}>{item.styleName}</Text>
            <Text style={styles.score}>{item.score}</Text>
            </View>
        ))}
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
      </View>
      <View>
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
    winLossContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    winLossItem: {
        alignItems: 'center',
        fontSize: 20,
    },
    winLossTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 20,
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
});

export default MyProfileScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useSelector } from "react-redux";
import axios from 'axios';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SearchScreen = () => {
  const [searchValue, setSearchValue] = useState('');
  const [athletes, setAthletes] = useState([]);
  const [following, setFollowing] = useState([]);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await axios.get('http://localhost:8000/api/v1/athletes');
      setAthletes(response.data);
    };
    fetchAthletes();
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    if (!athleteId) return;
    
    // Extract numeric ID if athleteId is an object
    const actualId = typeof athleteId === 'object' && athleteId !== null ? 
                    athleteId.athleteId : athleteId;
                    
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/athletes/following/${actualId}`,
      );
      console.log("response from fetch following: ", response)
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
      setFollowing([]);
    }
  };

  const filteredAthletes = () => {
    // Extract numeric ID if athleteId is an object
    const actualId = typeof athleteId === 'object' && athleteId !== null ? 
                    athleteId.athleteId : athleteId;
                    
    return athletes.filter((athlete) =>
      athlete.athlete_id !== actualId &&
      (athlete.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        athlete.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        athlete.lastName.toLowerCase().includes(searchValue.toLowerCase())),
    );
  };

  const isFollowing = (athleteId) => {
    if (!following) {
      return false;
    }
    return following.some((id) => id === athleteId);
  };

  const handleFollow = async (followedId) => {
    if (!athleteId) return;
    
    // Extract numeric ID if athleteId is an object
    const actualId = typeof athleteId === 'object' && athleteId !== null ? 
                    athleteId.athleteId : athleteId;
    
    const payload = {
      followerId: actualId,
      followedId: followedId,
    }
    
    console.log("payload for following: ", payload)
    
    if (isFollowing(followedId)) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/athletes/${actualId}/${followedId}/unfollow`);
        fetchFollowing();
      } catch (error) {
        console.error("Error unfollowing athlete:", error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/athletes/follow', payload);
        console.log("Follow response:", response.data);
        fetchFollowing();
      } catch (error) {
        console.error("Error following athlete:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{`${item.firstName} ${item.lastName} (${item.username})`}</Text>
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing(item.athlete_id)
            ? styles.followingButton
            : styles.notFollowingButton,
        ]}
        onPress={() => handleFollow(item.athlete_id)}
      >
        <Text style={isFollowing(item.athlete_id) ? styles.blackText : styles.whiteText}>
          {isFollowing(item.athlete_id) ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Athlete Search</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for athletes"
        onChangeText={(text) => setSearchValue(text)}
        value={searchValue}
      />
      <FlatList
        data={filteredAthletes()}
        renderItem={renderItem}
        keyExtractor={(item) => item.athlete_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    // backgroundColor: "black"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 80,
  },
  searchBar: {
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    justifyContent: 'center',
    // width: screenWidth * 1,
    height: screenHeight * 0.08,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  followButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    },
    followingButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    },
    notFollowingButton: {
    backgroundColor: 'black',
    },
    whiteText: {
    color: 'white',
    },
    blackText: {
    color: 'black',
    },
});

export default SearchScreen;
   

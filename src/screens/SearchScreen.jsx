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
import { API_BASE_URL } from "../config/api";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SearchScreen = () => {
  const [searchValue, setSearchValue] = useState('');
  const [athletes, setAthletes] = useState([]);
  const [following, setFollowing] = useState([]);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  useEffect(() => {
    console.log("SearchScreen useEffect triggered, athleteId:", athleteId);
    const fetchAthletes = async () => {
      console.log("Fetching all athletes");
      const response = await axios.get(`${API_BASE_URL}/api/v1/athletes`);
      setAthletes(response.data);
    };
    fetchAthletes();
    fetchFollowing();
  }, [athleteId]);

  const fetchFollowing = async () => {
    if (!athleteId) {
      console.log("No athleteId available, skipping fetchFollowing");
      return;
    }
    
    // Extract numeric ID if athleteId is an object
    const actualId = typeof athleteId === 'object' && athleteId !== null ? 
                    athleteId.athleteId : athleteId;
    console.log("Fetching following list for athlete ID:", actualId);
                    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/athletes/following/${actualId}`,
      );
      console.log("Following list received:", response.data);
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
      console.error("Error details:", error.response?.data || error.message);
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
    if (!athleteId) {
      console.log("No athleteId available, cannot follow/unfollow");
      return;
    }
    
    // Extract numeric ID if athleteId is an object
    const actualId = typeof athleteId === 'object' && athleteId !== null ? 
                    athleteId.athleteId : athleteId;
    
    const payload = {
      followerId: actualId,
      followedId: followedId,
    }
    
    console.log("Follow/unfollow payload:", payload);
    console.log("Current following status:", isFollowing(followedId));
    
    if (isFollowing(followedId)) {
      try {
        console.log("Attempting to unfollow athlete:", followedId);
        const response = await axios.delete(`${API_BASE_URL}/api/v1/athletes/${actualId}/${followedId}/unfollow`);
        console.log("Unfollow response:", response.data);
        await fetchFollowing(); // Use await to ensure the list is updated
      } catch (error) {
        console.error("Error unfollowing athlete:", error);
        console.error("Error details:", error.response?.data || error.message);
      }
    } else {
      try {
        console.log("Attempting to follow athlete:", followedId);
        const response = await axios.post(`${API_BASE_URL}/api/v1/athletes/follow`, payload);
        console.log("Follow response:", response.data);
        await fetchFollowing(); // Use await to ensure the list is updated
      } catch (error) {
        console.error("Error following athlete:", error);
        console.error("Error details:", error.response?.data || error.message);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.athleteName}>{`${item.firstName} ${item.lastName} (${item.username})`}</Text>
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
    height: screenHeight * 0.08,
    fontSize: 18, // Increased font size for search bar
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
  athleteName: {  // New style for athlete names
    fontSize: 20,
    fontWeight: '500',
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


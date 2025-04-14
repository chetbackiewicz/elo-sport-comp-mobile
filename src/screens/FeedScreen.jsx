import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const FeedScreen = () => {
  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [commentInputVisible, setCommentInputVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  const fetchFeedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!athleteId) {
        console.error("No athlete ID available for feed");
        setError("You need to be logged in to view your feed");
        setLoading(false);
        return;
      }
      
      console.log("Fetching feed for athlete ID:", athleteId);
      const response = await axios.get(`http://localhost:8000/api/v1/feed/${athleteId}`);
      console.log("Feed response:", response);
      console.log("Feed data:", response.data);
      
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log("Feed is empty. You might not be following any athletes with completed bouts.");
        setError("Your feed is empty. Follow more athletes or wait for bout results!");
      }
      
      setFeedData(response.data || []);
    } catch (error) {
      console.error("Error fetching feed data:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      setError("Could not load feed data. Please try again later.");
      setFeedData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeedData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const renderItem = ({ item }) => {
    const winner = item.winnerId === item.challengerId ? item.challengerFirstName + " " + item.challengerLastName  : item.acceptorFirstName + " " + item.acceptorLastName;
    const loser = item.loserId === item.challengerId ? item.challengerFirstName + " " + item.challengerLastName : item.acceptorFirstName + " " + item.acceptorLastName;
    const challengerScoreChange = item.winnerId === item.challengerId ? item.winnerScore : item.loserScore;
    const acceptorScoreChange = item.winnerId === item.acceptorId ? item.winnerScore : item.loserScore;
  
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.challengerFirstName + " " + item.challengerLastName + " vs. " + item.acceptorFirstName + " " + item.acceptorLastName}</Text>
        <Text style={styles.subTitle}>{item.style}</Text>
        <Text style={styles.decision}>Winner: {winner}</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Challenger:</Text>
            <Text>{`${item.challengerFirstName} ${item.challengerLastName}`}</Text>
            <Text>
              Score: {challengerScoreChange}
            </Text>
          </View>
          <View style={styles.column}>
            <Text>Acceptor:</Text>
            <Text>{`${item.acceptorFirstName} ${item.acceptorLastName}`}</Text>
            <Text>
              Score: {acceptorScoreChange}
            </Text>
          </View>
        </View>
        <View style={styles.interactionSection}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="thumbs-up" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setCommentInputVisible(!commentInputVisible)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {commentInputVisible && (
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Loading feed data...</Text>
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{error}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : feedData.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Your feed is empty!</Text>
          <Text style={styles.messageSubText}>Follow athletes or check back after more bouts are completed.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.boutId.toString()} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Decrease the padding value
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginTop: 10,
    backgroundColor: 'rgba(169,169,169,0.1)', // Add grey area
    borderRadius: 5, // Add rounded corners
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  decision: {
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  column: {
    alignItems: 'center',
  },
  interactionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  commentInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageSubText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  refreshButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FeedScreen;

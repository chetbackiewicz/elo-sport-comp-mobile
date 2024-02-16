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

  const athleteId = useSelector((state) => state.athlete.athleteId);

  const fetchFeedData = async () => {
    console.log('athlete id for feed: ', athleteId);
    const response = await axios.get(`http://localhost:8000/api/v1/feed/${athleteId.athleteId}`);
    setFeedData(response.data);
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
            <Text>{`${item.acceptorFirstName} ${item.acceptorLastName}`}{console.log(item.boutId)}</Text>
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
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.boutId.toString()} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  //   <>
  //     <ul>
  //       {this.state.allTexts.map((text, i) => (
  //         <li key={i}
  //         <span>Text: {text}</span>
  //         </li>
  //     )}
  //     </ul>
  //  </>
    
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
});

export default FeedScreen;

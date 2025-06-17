// ELOProgressionScreen.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from "../config/api";

const screenWidth = Dimensions.get('window').width;

/**
 * Screen component that displays line charts showing an athlete's ELO score progression over time for each style
 */
const ELOProgressionScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [styleMap, setStyleMap] = useState({});
  const [loading, setLoading] = useState(true);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  /**
   * Fetches the mapping of style IDs to style names
   */
  const fetchStyles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/styles`);
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
      Alert.alert('Error', 'Failed to load styles');
    }
  };

  /**
   * Fetches the current scores for the athlete to get the list of styles they compete in
   */
  const fetchCurrentScores = async () => {
    try {
      const actualId = typeof athleteId === 'object' ? athleteId.athleteId : athleteId;
      const response = await fetch(`${API_BASE_URL}/api/v1/score/${actualId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status fetching scores: ${response.status}`);
      }
      const scoreJson = await response.json();
      return scoreJson || [];
    } catch (error) {
      console.error('Error fetching current scores:', error);
      Alert.alert('Error', 'Failed to load current scores');
      return [];
    }
  };

  /**
   * Fetches score history for a specific athlete and style
   */
  const fetchScoreHistory = async (athleteId, styleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/score/${athleteId}/style/${styleId}/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status fetching history: ${response.status}`);
      }
      const historyJson = await response.json();
      return historyJson;
    } catch (error) {
      console.error(`Error fetching history for style ${styleId}:`, error);
      return null;
    }
  };

  /**
   * Fetches all score history data for all styles the athlete competes in
   */
  const fetchAllHistoryData = async () => {
    setLoading(true);
    try {
      if (!athleteId) {
        console.log('No athlete ID found');
        return;
      }

      await fetchStyles();
      const currentScores = await fetchCurrentScores();
      
      const actualId = typeof athleteId === 'object' ? athleteId.athleteId : athleteId;
      
      const historyPromises = currentScores.map(async (score) => {
        const history = await fetchScoreHistory(actualId, score.styleId);
        return history;
      });

      const historyResults = await Promise.all(historyPromises);
      const validHistories = historyResults.filter(history => history !== null);
      
      setHistoryData(validHistories);
    } catch (error) {
      console.error('Error fetching history data:', error);
      Alert.alert('Error', 'Failed to load score history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistoryData();
  }, [athleteId]);

  /**
   * Converts score history data into format suitable for line chart
   */
  const prepareChartData = (history) => {
    if (!history || !history.history || history.history.length === 0) {
      return null;
    }

    // Sort by date to ensure proper chronological order
    const sortedHistory = [...history.history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedHistory.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: sortedHistory.map(item => item.score),
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  /**
   * Renders a single line chart for a style
   */
  const renderChart = (history, index) => {
    const chartData = prepareChartData(history);
    if (!chartData) {
      return null;
    }

    const styleName = styleMap[history.styleId] || 'Unknown Style';

    return (
      <View key={index} style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{styleName}</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#8641f4',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading score history...</Text>
      </View>
    );
  }

  if (!historyData || historyData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No score history available</Text>
        <Text style={styles.noDataSubText}>Complete more bouts to see your ELO progression!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ELO Score Progression</Text>
      {historyData.map((history, index) => renderChart(history, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataSubText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default ELOProgressionScreen;
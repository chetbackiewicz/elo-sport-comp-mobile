import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';

const StyleSelectorScreen = (props) => {
  const [styles, setStyles] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    console.log("The athlete id when selecting style:", athleteId);
    try {
      const response = await fetch('http://localhost:8000/api/v1/styles');
      const data = await response.json();
      setStyles(data);
    } catch (error) {
      console.log('Error fetching styles:', error);
    }
  };

  const toggleStyle = (styleId) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter((id) => id !== styleId));
      console.log("styles ", selectedStyles)
    } else {
      console.log("styles ", selectedStyles)
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  const handleSubmit = async () => {
    console.log("final athleteId ", athleteId);
    console.log("final styles ", selectedStyles)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/styles/athlete/${athleteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ athleteId, styles: selectedStyles }),
      });

      if (response.ok) {
        props.navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', 'There was an error submitting the styles. Please try again.');
      }
    } catch (error) {
      console.log('Error submitting styles:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={layout.container}>
      <Text style={layout.title}>Select your styles</Text>
      {styles.map((style) => (
        <TouchableOpacity
          key={style.styleId}
          style={[
            layout.styleButton,
            selectedStyles.includes(style.styleId) && layout.styleButtonSelected,
          ]}
          onPress={() => toggleStyle(style.styleId)}
        >
          <Text
            style={[
              layout.styleButtonText,
              selectedStyles.includes(style.styleId) && layout.styleButtonTextSelected,
            ]}
          >
            {style.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={layout.submitButton} onPress={handleSubmit}>
        <Text style={layout.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const layout = StyleSheet.create({
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
  styleButton: {
    alignSelf: 'center',
    width: '80%',
    height: '8%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  styleButtonSelected: {
    backgroundColor: '#000',
  },
  styleButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  styleButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderRadius: 5,
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    marginTop: 50,
    alignSelf: 'center',
    width: '80%',
    height: '8%',
  },
  submitButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
  },
});

export default StyleSelectorScreen;

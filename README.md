# ELO Sport Competition Mobile App

A React Native mobile application for tracking athlete performance, ELO ratings, and martial arts competitions.

## Overview

The ELO Sport Competition app allows athletes to:
- View and track their ELO ratings across different martial arts styles
- Visualize rating progress over time
- Challenge other athletes
- Browse competition feed
- Manage their profile information

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Xcode (for iOS simulator)
- iOS Simulator

### Setup
1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Start the development server
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

## Running on iOS Simulator

1. Install Expo CLI globally if you haven't already:
   ```
   npm install -g expo-cli
   ```

2. Make sure you have Xcode installed (available on the Mac App Store)

3. Open Xcode and install required iOS Simulator:
   - Launch Xcode
   - Go to Preferences > Components
   - Download a simulator (e.g., iPhone 13)

4. Start the Expo development server:
   ```
   npx expo start
   ```

5. When the Expo DevTools appear in your browser or terminal:
   - Press `i` to open in iOS simulator
   - Or click "Run on iOS simulator" option in the Expo DevTools interface

6. The iOS Simulator will launch automatically and install the Expo app
   - The app will load and connect to your Expo development server
   - Changes to your code will automatically reload in the simulator

7. To stop the app:
   - Press Ctrl+C in the terminal running the Expo server
   - Close the iOS Simulator window

8. Ensure the api is running on port 8000
   - https://github.com/chetbackiewicz/elo-sport-comp


## Features

### Authentication
- User registration
- Secure login/logout functionality
- Profile management

### Athlete Profiles
- View personal ELO ratings
- Track rating history with interactive charts
- View win/loss record

### Competition
- Challenge other athletes
- View competition feed
- Search for athletes and gyms

### Style System
- Support for multiple martial arts styles
- Style-specific ELO ratings

## Project Structure

- `src/actions`: Redux actions for API communication
- `src/assets`: Static assets like images
- `src/components`: Reusable UI components
- `src/config`: Application configuration and API setup
- `src/reducers`: Redux state management
- `src/screens`: Application screens/pages

## Key Screens

- `WelcomeScreen`: Initial landing screen
- `LoginScreen` & `RegistrationScreen`: Authentication
- `MyProfileScreen`: User profile and ELO ratings
- `FeedScreen`: Activity and competition feed
- `ChallengeScreen`: Challenge other athletes
- `SearchScreen`: Find athletes and gyms
- `StyleSelectorScreen`: Select martial arts styles

## API Integration

The application connects to a backend API for:
- User authentication
- ELO rating retrieval and updates
- Competition data
- Athlete information

## Dependencies

- React Native
- Expo
- Redux & React Redux
- React Navigation
- Native Base
- React Native Chart Kit (for ELO history visualization)

## Contributing

Please see the contributing guidelines before submitting pull requests.

## License

This project is proprietary software.

---
© 2025 ELO Sport Competition. All rights reserved.

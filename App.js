import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Platform, Text, Button, View, StyleSheet } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export default function App() {
  const LOCATION_TASK_NAME = 'background-location-task';
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [text, setText] = useState('Waiting ...');

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    }
  };
  
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      setErrorMsg(error.message)
      return;
    }
    if (data) {
      const { locations } = data;
      setText(JSON.stringify(locations))
      // do something with the locations captured in the background
    }
  });

  return (
    <View style={styles.container}>
      <Text>{ text }</Text>
    <Button onPress={requestPermissions} title="Enable background location" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

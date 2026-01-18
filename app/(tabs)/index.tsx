import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'instant_summary';

export default function InstantScreen() {
  const [text, setText] = useState('Summaries will appear here');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) setText(saved);
    })();
  }, []);

  const onChangeText = async (value: string) => {
    setText(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  return (
    <View style={styles.container}>
      {/* PNG LOGO */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* LAUNCH BUTTON */}
      <Pressable style={styles.launchButton} onPress={() => {}}>
        <Ionicons name="play" size={20} color="#fff" />
        <Text style={styles.launchText}>Launch</Text>
      </Pressable>

      {/* TEXT AREA */}
      <TextInput
        style={styles.textArea}
        multiline
        textAlignVertical="top"
        value={text}
        onChangeText={onChangeText}
        placeholder="Summaries will appear here"
        placeholderTextColor="#8A8A8A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 32,
  },
  launchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F80ED',
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
    marginBottom: 30,
    marginTop: -50,
  },
  launchText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  textArea: {
    height: 360,
    backgroundColor: '#222222',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
});

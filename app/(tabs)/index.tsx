import React, { useEffect, useRef, useState } from 'react';
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
const API_KEY_KEY = 'mobilerun_api_key';
const DEVICE_ID_KEY = 'mobilerun_device_id';

export default function InstantScreen() {
  const [text, setText] = useState('Summaries will appear here');

  const [apiKey, setApiKey] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('idle');
  const [taskId, setTaskId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    (async () => {
      const savedText = await AsyncStorage.getItem(STORAGE_KEY);
      const savedApiKey = await AsyncStorage.getItem(API_KEY_KEY);
      const savedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

      if (savedText !== null) setText(savedText);

      if (savedApiKey && savedDeviceId) {
        setApiKey(savedApiKey);
        setDeviceId(savedDeviceId);
        setIsSetupComplete(true);
      }
    })();
  }, []);

  const persistText = async (value: string) => {
    setText(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  const appendLog = async (message: string) => {
    const entry = `\n\n[LOG]\n${message}`;
    const updated = text + entry;
    setText(updated);
    await AsyncStorage.setItem(STORAGE_KEY, updated);
  };

  const saveSetup = async () => {
    if (!apiKey || !deviceId) {
      await appendLog('Setup error: API key or Device ID missing');
      return;
    }

    await AsyncStorage.setItem(API_KEY_KEY, apiKey);
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    setIsSetupComplete(true);
  };

  const launchTask = async () => {
    setStatusText('creating task...');
    setIsRunning(true);

    const prompt = `Open the Instagram app.

Wait until the home screen is fully loaded.

Tap on the Chats button (arrow / paper-plane icon) located in the bottom navigation bar.

On the Chats screen:
- Tap the Filter button located to the left of the "Primary" tab.
- Select the "Unread" filter.

For each chat shown in the Unread list, do the following one by one:

1. Open the chat.

2. For each unread item (you may need to scroll up a little to check other unread/unreplied items) in the chat (message or reel), process in top-to-bottom order:

   - If the unread item is a text message:
     - Read the message.
     - Generate a short, natural reply based on the message content.
     - Swipe right on the message to open the reply input.
     - Send the reply.

   - If the unread item is a reel:
     - Tap on the reel to open it.
     - Wait for the reel to load.
     - Open the comments section of the reel.
     - Read the top visible comments.
     - Determine the overall sentiment of the comments:
       - Based on the sentiment, generate an appropriate response.
     - Go back to the chat screen using the back button as needed.
     - Swipe right on the reel message to open the reply input.
     - Send the generated response.

3. Ensure all unread items in the current chat are handled.

4. Go back to the Unread Chats list.

Repeat this process for every unread chat.

After all unread chats are processed:
- Close the Instagram app.

Finally, Open the Instant app (com.gdg.instant) and clear the text area if anything is present and put the following output there: 
- Number of chats processed
- Number of messages replied to
- Number of reels replied to
- Any message that required special attention or appeared urgent
- An overall summary message

then, terminate.`;

    try {
      abortRef.current = new AbortController();

      const res = await fetch('https://api.mobilerun.ai/v1/tasks/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: prompt,
          llmModel: 'google/gemini-2.5-flash',
          deviceId,
        }),
        signal: abortRef.current.signal,
      });

      const raw = await res.text();
      await appendLog(`CREATE RESPONSE (${res.status}):\n${raw}`);

      if (!res.ok) {
        setStatusText('create failed');
        setIsRunning(false);
        return;
      }

      const json = JSON.parse(raw);
      const id = json.id || json.taskId || json.task?.id || null;

      if (!id) {
        setStatusText('no taskId returned');
        setIsRunning(false);
        await appendLog('ERROR: No taskId in response');
        return;
      }

      setTaskId(id);
      setStatusText('running');
    } catch (e: any) {
      await appendLog(`NETWORK ERROR:\n${e.message || String(e)}`);
      setStatusText('network error');
      setIsRunning(false);
    }
  };

  const terminateTask = async () => {
    if (!taskId) return;

    setStatusText('terminating...');

    try {
      const res = await fetch(
        `https://api.mobilerun.ai/v1/tasks/${taskId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const raw = await res.text();
      await appendLog(`CANCEL RESPONSE (${res.status}):\n${raw}`);

      setIsRunning(false);
      setTaskId(null);
      setStatusText('terminated');
    } catch (e: any) {
      await appendLog(`TERMINATE ERROR:\n${e.message || String(e)}`);
      setStatusText('terminate error');
    }
  };

  /* ---------- SETUP SCREEN ---------- */
  if (!isSetupComplete) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.setupTitle}>Setup</Text>

        <TextInput
          style={styles.input}
          placeholder="Mobilerun API Key"
          placeholderTextColor="#8A8A8A"
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Device ID"
          placeholderTextColor="#8A8A8A"
          value={deviceId}
          onChangeText={setDeviceId}
          autoCapitalize="none"
        />

        <Pressable style={styles.launchButton} onPress={saveSetup}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.launchText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  /* ---------- MAIN SCREEN ---------- */
  return (
    <View style={styles.container}>
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>{statusText}</Text>
        {taskId ? <Text style={styles.taskId}>#{taskId}</Text> : null}
      </View>

      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Pressable
        style={[styles.launchButton, isRunning && styles.terminateButton]}
        onPress={isRunning ? terminateTask : launchTask}
      >
        <Ionicons name={isRunning ? 'stop' : 'play'} size={20} color="#fff" />
        <Text style={styles.launchText}>
          {isRunning ? 'Terminate' : 'Launch'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.textArea}
        multiline
        textAlignVertical="top"
        value={text}
        onChangeText={persistText}
        placeholder="Summaries will appear here"
        placeholderTextColor="#8A8A8A"
      />
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    padding: 24,
    justifyContent: 'center',
  },
  statusWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'flex-end',
  },
  statusText: {
    color: '#BFCFFD',
    fontSize: 12,
    marginTop: 30,
    fontWeight: '600',
  },
  taskId: {
    color: '#9AA6C7',
    fontSize: 11,
    marginTop: 2,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  setupTitle: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -60,
  },
  input: {
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    marginBottom: 14,
  },
  launchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F80ED',
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
    marginTop: 10,
  },
  terminateButton: {
    backgroundColor: '#D64545',
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
    marginTop: 20,
  },
});

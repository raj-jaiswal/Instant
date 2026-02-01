import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const CONTEXT_KEY = "context_json";
const API_KEY_KEY = "mobilerun_api_key";
const DEVICE_ID_KEY = "mobilerun_device_id";

export default function ContextScreen() {
  const [jsonText, setJsonText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CONTEXT_KEY);
        if (stored) setJsonText(stored);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const saveContext = async () => {
    // Validate JSON first so we don't save invalid blobs
    try {
      JSON.parse(jsonText || "{}");
    } catch (e: any) {
      setMessage("Invalid JSON — please fix formatting.");
      return;
    }

    try {
      await AsyncStorage.setItem(CONTEXT_KEY, jsonText);
      setMessage("Context saved.");
      setTimeout(() => setMessage(null), 2000);
    } catch (e) {
      setMessage("Failed to save context.");
    }
  };

  const formatContext = () => {
    try {
      const parsed = JSON.parse(jsonText || "{}");
      const pretty = JSON.stringify(parsed, null, 2);
      setJsonText(pretty);
      setMessage("Formatted JSON.");
      setTimeout(() => setMessage(null), 1500);
    } catch (e) {
      setMessage("Can't format: invalid JSON.");
    }
  };

  const clearContext = async () => {
    setJsonText("");
    try {
      await AsyncStorage.removeItem(CONTEXT_KEY);
      setMessage("Context cleared.");
      setTimeout(() => setMessage(null), 1500);
    } catch {
      setMessage("Failed to clear context.");
    }
  };

  const logout = async () => {
    // optional confirmation
    Alert.alert(
      "Log out",
      "This will remove the saved API Key and Device ID. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(API_KEY_KEY);
              await AsyncStorage.removeItem(DEVICE_ID_KEY);
              setMessage("Logged out (API key & Device ID cleared).");
              setTimeout(() => setMessage(null), 2500);
              BackHandler.exitApp();
            } catch {
              setMessage("Failed to clear credentials.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Context</Text>

      <Text style={styles.hint}>
        Paste a JSON object here containing context about people you chat with
        (names, preferences, notes).
      </Text>

      <TextInput
        style={styles.textArea}
        multiline
        textAlignVertical="top"
        value={jsonText}
        onChangeText={setJsonText}
        placeholder='{"alice": {"notes": "loves coffee"}, "bob": {"timezone":"Asia/Kolkata"}}'
        placeholderTextColor="#8A8A8A"
      />

      <View style={styles.row}>
        <Pressable style={styles.actionButton} onPress={saveContext}>
          <Ionicons name="save" size={18} color="#fff" />
          <Text style={styles.actionText}>Save</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={formatContext}>
          <Ionicons name="brush" size={18} color="#fff" />
          <Text style={styles.actionText}>Format</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={clearContext}>
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.actionText}>Clear</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Log out (clear API key & device)</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    color: "#8A8A8A",
    fontSize: 13,
    marginBottom: 12,
  },
  textArea: {
    flex: 1,
    backgroundColor: "#222222",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginHorizontal: 4,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#D64545",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222222",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  message: {
    color: "#BFCFFD",
    marginTop: 12,
    textAlign: "center",
  },
});

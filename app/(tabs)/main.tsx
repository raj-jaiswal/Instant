import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "instant_summary";
const API_KEY_KEY = "mobilerun_api_key";
const DEVICE_ID_KEY = "mobilerun_device_id";
const LOGS_KEY = "instant_logs";
const CONTEXT_KEY = "context_json";

type AppType = "instagram" | "whatsapp" | "linkedin";

export default function InstantScreen() {
  const [text, setText] = useState("");

  const [apiKey, setApiKey] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const [selectedApp, setSelectedApp] = useState<AppType>("instagram");

  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState("idle");
  const [taskId, setTaskId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const [contextJson, setContextJson] = useState<string>("{}");

  const sessionTextRef = useRef("");
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    (async () => {
      const savedText = await AsyncStorage.getItem(STORAGE_KEY);
      const savedApiKey = await AsyncStorage.getItem(API_KEY_KEY);
      const savedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

      if (savedText !== null) {
        setText(savedText);
        sessionTextRef.current = savedText;
      }

      if (savedApiKey && savedDeviceId) {
        setApiKey(savedApiKey);
        setDeviceId(savedDeviceId);
        setIsSetupComplete(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (statusText === "terminated" && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      saveSessionLog("agent");
    }
  }, [statusText]);

  useEffect(() => {
    (async () => {
      const savedText = await AsyncStorage.getItem(STORAGE_KEY);
      const savedApiKey = await AsyncStorage.getItem(API_KEY_KEY);
      const savedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      const savedContext = await AsyncStorage.getItem(CONTEXT_KEY);

      if (savedText !== null) {
        setText(savedText);
        sessionTextRef.current = savedText;
      }

      if (savedContext) {
        setContextJson(savedContext);
      }

      if (savedApiKey && savedDeviceId) {
        setApiKey(savedApiKey);
        setDeviceId(savedDeviceId);
        setIsSetupComplete(true);
      }
    })();
  }, []);


  const saveSessionLog = async (reason: "user" | "error" | "agent") => {
    try {
      const existing = await AsyncStorage.getItem(LOGS_KEY);
      const logs = existing ? JSON.parse(existing) : [];

      const entry = {
        id: Date.now().toString(),
        app: selectedApp,
        endedAt: Date.now(),
        reason,
        summaryText: sessionTextRef.current,
      };

      logs.unshift(entry);
      await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    } catch {}
  };

  const persistText = async (value: string) => {
    setText(value);
    sessionTextRef.current = value;
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  const appendLog = async (message: string) => {
    setText((prev) => {
      const sep = prev.length === 0 ? "" : "\n\n";
      const updated = prev + sep + "[LOG]\n" + message;

      sessionTextRef.current = updated;
      AsyncStorage.setItem(STORAGE_KEY, updated);

      return updated;
    });
  };

  const saveSetup = async () => {
    if (!apiKey || !deviceId) {
      await appendLog("Setup error: API key or Device ID missing");
      return;
    }

    await AsyncStorage.setItem(API_KEY_KEY, apiKey);
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    setIsSetupComplete(true);
  };

const buildPrompt = (basePrompt: string) => {
  return `
IMPORTANT CONTEXT (JSON):
-------------------------
${contextJson || "{}"}
-------------------------

You must use this context to personalize replies.
If new information about any person is discovered, update the context.

${basePrompt}

AFTER COMPLETING ALL TASKS:
1. Open the Instant app (com.gdg.instant)
2. Navigate to the "Context" tab using the bottom navigation bar
3. Update the JSON context with any new or refined information in the textbox
4. Save the context
5. Navigate back to "Home" using the bottom navigation bar
6. Write a detailed summary of your actions, and clearly mention if there was anything Important in the chats in the textbox provided.
7. Press the Terminate button to exit
`;
  };

  const PROMPTS: Record<AppType, string> = {
    instagram: `Open the Instagram app.

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
`,

    whatsapp: `Open the WhatsApp app.

Wait until the chat list is fully loaded.
Click on the unread filter (below search button and right of All filter).
Identify all chats with unread message indicators.

For each unread chat, open it and read all unread messages.

For each unread message:
- Click on the chats
- Generate a short, polite, and contextually appropriate reply.
- Send the reply.

If media messages are present:
- Open briefly if needed.
- Respond appropriately.

After processing the chat, return to the chat list.

Repeat for all unread chats.

After all unread chats are processed:
- Close the WhatsApp app.

`,

    linkedin: `Open the LinkedIn app.

Wait until the home feed is fully loaded.

Navigate to the Messages section (from top right corner).

Identify all conversations with unread messages.

For each unread conversation:
- Open the conversation.
- Read all unread messages.
- Generate a professional, concise reply.
- Send the reply.

Pay special attention to recruiter messages, job opportunities, and urgent professional requests.

After all unread conversations are processed:
- Close the LinkedIn app.
`,
  };

  const launchTask = async () => {
    sessionTextRef.current = "";
    hasLoggedRef.current = false;

    await AsyncStorage.removeItem(STORAGE_KEY);
    setText("");

    setStatusText("creating task...");
    setIsRunning(true);

    const appPackage =
      selectedApp === "instagram"
        ? "com.instagram.android"
        : selectedApp === "whatsapp"
        ? "com.whatsapp"
        : "com.linkedin.android";

    try {
      abortRef.current = new AbortController();

      const res = await fetch("https://api.mobilerun.ai/v1/tasks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: buildPrompt(PROMPTS[selectedApp]),
          llmModel: "google/gemini-3-flash",
          maxSteps: 1000,
          executionTimeout: 1000,
          temperature: 0.5,
          reasoning: true,
          vision: true,
          apps: [appPackage, "com.gdg.instant"],
          deviceId,
        }),
        signal: abortRef.current.signal,
      });

      const raw = await res.text();
      await appendLog(`CREATE RESPONSE (${res.status}):\n${raw}`);

      if (!res.ok) {
        setStatusText("terminated");
        setIsRunning(false);
        return;
      }

      const json = JSON.parse(raw);
      const id = json.id || json.taskId || json.task?.id || null;

      if (!id) {
        await appendLog("ERROR: No taskId in response");
        setStatusText("terminated");
        setIsRunning(false);
        return;
      }

      setTaskId(id);
      setStatusText("running");
    } catch (e: any) {
      await appendLog(`NETWORK ERROR:\n${e.message || String(e)}`);
      setStatusText("terminated");
      setIsRunning(false);
    }
  };

  const terminateTask = async () => {
    if (!taskId) return;

    setStatusText("terminating...");

    try {
      await fetch(`https://api.mobilerun.ai/v1/tasks/${taskId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
    } finally {
      setIsRunning(false);
      setTaskId(null);
      setStatusText("terminated");
    }
  };

  if (!isSetupComplete) {
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
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

        <Pressable style={styles.continueButton} onPress={saveSetup}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.launchText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>{statusText}</Text>
        {taskId ? <Text style={styles.taskId}>#{taskId}</Text> : null}
      </View>

      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      {/* APP SELECTOR (ADDED) */}
      <View style={styles.appSelector}>
        <Pressable
        onPress={() => setSelectedApp("instagram")}
        style={[
            styles.selector,
            selectedApp === "instagram" && styles.selectorActive,
        ]}
        >
          <Ionicons
            name="logo-instagram"
            size={28}
            color={selectedApp === "instagram" ? "#fff" : "#8A8A8A"}
          />
        </Pressable>
        <Pressable
        onPress={() => setSelectedApp("whatsapp")}
        style={[
            styles.selector,
            selectedApp === "whatsapp" && styles.selectorActive,
        ]}
        >
          <Ionicons
            name="logo-whatsapp"
            size={28}
            color={selectedApp === "whatsapp" ? "#fff" : "#8A8A8A"}
          />
        </Pressable>
        <Pressable
        onPress={() => setSelectedApp("linkedin")}
        style={[
            styles.selector,
            selectedApp === "linkedin" && styles.selectorActive,
        ]}
        >
          <Ionicons
            name="logo-linkedin"
            size={28}
            color={selectedApp === "linkedin" ? "#fff" : "#8A8A8A"}
          />
        </Pressable>
      </View>

      <Pressable
        style={[styles.launchButton, isRunning && styles.terminateButton]}
        onPress={isRunning ? terminateTask : launchTask}
      >
        <Ionicons name={isRunning ? "stop" : "play"} size={20} color="#fff" />
        <Text style={styles.launchText}>
          {isRunning ? "Terminate" : "Launch"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 24,
    justifyContent: "center",
  },
  statusWrapper: {
    position: "absolute",
    top: 16,
    right: 16,
    alignItems: "flex-end",
  },
  statusText: {
    color: "#BFCFFD",
    fontSize: 12,
    marginTop: 30,
    fontWeight: "600",
  },
  taskId: {
    color: "#9AA6C7",
    fontSize: 11,
    marginTop: 2,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 24,
  },
  setupTitle: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    marginTop: -60,
  },
  input: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginBottom: 14,
  },
  launchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
    marginTop: -20,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
    marginTop: 10,
  },
  terminateButton: {
    backgroundColor: "#D64545",
  },
  launchText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  textArea: {
    height: 360,
    backgroundColor: "#222222",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginTop: 20,
  },
  appSelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 40,
  },
  selector: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  
  selectorActive: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGS_KEY = 'instant_logs';

export default function LogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(LOGS_KEY);
      setLogs(stored ? JSON.parse(stored) : []);
    })();
  }, []);

    const clearLogs = async () => {
    await AsyncStorage.removeItem(LOGS_KEY);
    setLogs([]);
    };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.app}>{item.app}</Text>
      <Text style={styles.meta}>
        Timestamp: {new Date(item.endedAt).toLocaleTimeString()}
      </Text>
      <Text style={styles.reason}>Reason: {item.reason}</Text>
      <Text style={styles.status}>{item.summaryText}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.clear} onPress={clearLogs}>
          Clear
      </Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No logs yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    padding: 16,
    paddingTop: 58,
  },

  card: {
    backgroundColor: '#222222',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  app: {
    color: '#BFCFFD',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: '#9AA6C7',
    fontSize: 12,
    marginTop: 2,
  },
  meta: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 2,
  },
  reason: {
    color: '#E6B566',
    marginTop: 6,
    fontSize: 13,
  },
  status: {
    color: '#FFFFFF',
    marginTop: 6,
    fontSize: 13,
  },
  empty: {
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 40,
  },

  clear: {
    color: '#E57373',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
  },
});

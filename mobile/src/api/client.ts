import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator maps 10.0.2.2 → host machine's localhost
const BASE_URL = 'http://10.0.2.2:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically for every request if one is stored
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;

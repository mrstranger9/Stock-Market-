import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const WS_BASE_URL = 'ws://localhost:8000/ws';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchStocks = async () => {
  const { data } = await apiClient.get('/stocks');
  return data;
};

export const fetchStock = async (symbol) => {
  const { data } = await apiClient.get(`/stocks/${symbol}`);
  return data;
};

export const fetchStockHistory = async (symbol, period = '1mo') => {
  const { data } = await apiClient.get(`/stocks/${symbol}/history?period=${period}`);
  return data;
};

export const fetchPrediction = async (symbol) => {
  const { data } = await apiClient.get(`/predict/${symbol}`);
  return data;
};

export const createWebSocket = (onMessage) => {
  const ws = new WebSocket(`${WS_BASE_URL}/stocks`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch(e) {
      console.error(e);
    }
  };
  return ws;
};

import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getUpcomingMatches = async () => {
  const res = await axios.get(`${API_URL}/matches/upcoming`);
  return res.data;
};

export const getRecentResults = async () => {
  const res = await axios.get(`${API_URL}/matches/recent`);
  return res.data;
};
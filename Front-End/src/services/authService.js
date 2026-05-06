import axios from 'axios';

const API_URL = 'http://localhost:8000/api/token/';

export const login = async (email, password) => {
  const response = await axios.post(API_URL, { email, password });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

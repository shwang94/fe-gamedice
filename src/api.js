import axios from 'axios';

const API_URL = 'http://localhost:8000';

// export const getUser = async (userId) => {
//   const response = await axios.get(`${API_URL}/users/${userId}`);
//   return response.data;
// }

export const createUser = async (body) => {
  const response = await axios.post(`${API_URL}/users`, body);
  return response.data;
}
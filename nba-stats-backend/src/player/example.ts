import axios from 'axios';
const API_URL = 'https://www.balldontlie.io/api/v1/players';
const API_KEY = process.env.BALLDONTLIE_API_KEY;
export const fetchPlayers = async (searchQuery: string = ''): Promise<any> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        search: searchQuery,
        per_page: 100
      },
      headers: {
        'Authorization': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching players data');
  }
};
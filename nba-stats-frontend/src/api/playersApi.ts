import axios from 'axios';
import { PlayerApiResponse } from '../interfaces/Player';
import { PlayerStats } from '../interfaces/PlayerStats';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const fetchPlayers = async (searchTerm: string, page: number, perPage: number): Promise<PlayerApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        search: searchTerm,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const fetchPlayerStats = async (playerId: number): Promise<PlayerStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players/stats`, {
      params: {
        player_id: playerId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};
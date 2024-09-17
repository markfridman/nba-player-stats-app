import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPlayers as fetchPlayersApi, fetchPlayerStats as fetchPlayerStatsApi } from '../api/playersApi';
import { Player, PlayerApiResponse } from '../interfaces/Player';
import { PlayerStats } from '../interfaces/PlayerStats';


interface PlayersState {
  list: Player[];
  favorites: Player[];
  playerStats: Record<number, PlayerStats>;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
}

const initialState: PlayersState = {
  list: [],
  favorites: [],
  playerStats: {},
  loading: false,
  error: null,
  searchTerm: '',
  currentPage: 1,
  totalPages: 1,
  totalCount: 1,
  perPage: 5
};

export const fetchPlayers = createAsyncThunk<
  PlayerApiResponse,
  { searchTerm: string; page: number; perPage: number },
  { rejectValue: string }
>(
  'players/fetchPlayers',
  async ({ searchTerm, page, perPage }: { searchTerm: string; page: number; perPage: number }, { rejectWithValue }) => {
    try {

      const response = await fetchPlayersApi(searchTerm, page, perPage);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPlayerStats = createAsyncThunk(
  'players/fetchPlayerStats',
  async (playerId: number, { rejectWithValue }) => {
    try {
      return await fetchPlayerStatsApi(playerId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.currentPage = 1;
    },
    addFavoritePlayer: (state, action: PayloadAction<Player>) => {
      if (!state.favorites.some(player => player.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavoritePlayer: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(player => player.id !== action.payload);
      delete state.playerStats[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.totalPages = action.payload.meta.total_pages;
        state.perPage = action.payload.meta.per_page;
        state.totalCount = action.payload.meta.total_count;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      }).addCase(fetchPlayerStats.fulfilled, (state, action) => {
        state.playerStats[action.payload.player_id] = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setCurrentPage,
  setPerPage,
  addFavoritePlayer,
  removeFavoritePlayer
} = playersSlice.actions;

export default playersSlice.reducer;
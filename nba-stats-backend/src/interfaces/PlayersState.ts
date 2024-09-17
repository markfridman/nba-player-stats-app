
import { Player } from './Player';
import { PlayerStats } from './PlayerStats';

export interface PlayersState {
  favoritePlayers: Player[];
  playerStats: Record<number, PlayerStats>;
}
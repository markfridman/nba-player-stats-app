import React from 'react';
import { Player, PlayerStats } from '../interfaces/Player';
import { Button } from '@/components/ui/button';
import styles from './FavoritePlayerCard.module.css';

interface FavoritePlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onRemoveFavorite: () => void;
}

export const FavoritePlayerCard: React.FC<FavoritePlayerCardProps> = ({ player, stats, onRemoveFavorite }) => {
  return (
    <div className={styles.card}>
      <div className={styles.playerInfo}>
        <h3 className={styles.playerName}>{player.first_name} {player.last_name}</h3>
        <p className={styles.playerTeam}>{player.team.full_name}</p>
      </div>
      {stats ? (
        <div className={styles.playerStats}>
          <h4>Season {stats.season} Stats</h4>
          <p>Games Played: {stats.games_played}</p>
          <p>Points: {stats.pts.toFixed(1)}</p>
          <p>Rebounds: {stats.reb.toFixed(1)}</p>
          <p>Assists: {stats.ast.toFixed(1)}</p>
          <p>Steals: {stats.stl.toFixed(1)}</p>
          <p>Blocks: {stats.blk.toFixed(1)}</p>
          <p>FG%: {(stats.fg_pct * 100).toFixed(1)}%</p>
          <p>3P%: {(stats.fg3_pct * 100).toFixed(1)}%</p>
          <p>FT%: {(stats.ft_pct * 100).toFixed(1)}%</p>
        </div>
      ) : (
        <div className={styles.loadingStats}>Loading stats...</div>
      )}
      <Button 
        className={styles.removeButton} 
        onClick={onRemoveFavorite}
      >
        Remove from Favorites
      </Button>
    </div>
  );
};
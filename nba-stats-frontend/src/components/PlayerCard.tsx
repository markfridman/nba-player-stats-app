import React from 'react';
import { Player } from '../interfaces/Player';
import { Button } from './ui/button';
import styles from './PlayerCard.module.css';

interface PlayerCardProps {
  player: Player;
  onAddFavorite?: (player: Player) => void;
  onRemoveFavorite?: (player: Player) => void;
  type: 'favorite' | 'other';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onAddFavorite, onRemoveFavorite, type }) => {
  return (
    <div className={styles.card}>
      <div className={styles.playerInfo}>
        <h3 className={styles.playerName}>{player.first_name} {player.last_name}</h3>
        <p className={styles.playerDetails}>Team: {player.team.full_name}</p>
      </div>
      <Button className={styles.actionButton} onClick={() => type === 'favorite' ? onRemoveFavorite?.(player) : onAddFavorite?.(player)}>{type === 'favorite' ? 'Remove' : 'Add to Favorites'}</Button>
    </div>
  );
};
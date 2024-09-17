import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFavoritePlayer, fetchPlayerStats } from '../store/playersSlice';
import { FavoritePlayerCard } from './FavoritePlayerCard';
import styles from './FavoritePlayerList.module.css';

export const FavoritePlayerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.players.favorites);
  const playerStats = useAppSelector((state) => state.players.playerStats);

  useEffect(() => {
    favorites.forEach(player => {
      if (!playerStats[player.id]) {
        dispatch(fetchPlayerStats(player.id));
      }
    });
  }, [dispatch, favorites, playerStats]);

  const handleRemoveFavorite = (playerId: number) => {
    dispatch(removeFavoritePlayer(playerId));
  };

  if (favorites.length === 0) {
    return <div className={styles.emptyMessage}>No favorite players yet.</div>;
  }

  return (
    <div className={styles.favoriteListContainer}>
      <h2 className={styles.title}>Favorite Players</h2>
      {favorites.map(player => (
        <FavoritePlayerCard 
          key={player.id} 
          player={player} 
          stats={playerStats[player.id]}
          onRemoveFavorite={() => handleRemoveFavorite(player.id)}
        />
      ))}
    </div>
  );
};
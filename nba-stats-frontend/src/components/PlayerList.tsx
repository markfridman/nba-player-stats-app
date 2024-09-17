import React, { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchPlayers, addFavoritePlayer, setCurrentPage, removeFavoritePlayer } from '../store/playersSlice';
import { Pagination } from './Pagination';
import { PlayerCard } from './PlayerCard';
import { Player } from '../interfaces/Player';
import styles from './PlayerList.module.css';

export const PlayerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    list,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    totalCount,
    favorites,
    perPage,
  } = useAppSelector((state) => state.players);

  useEffect(() => {
    dispatch(fetchPlayers({ searchTerm, page: currentPage, perPage: 8 }));
  }, [dispatch, searchTerm, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const handleToggleFavorite = useCallback((player: Player) => {
    if (favorites.some(fav => fav.id === player.id)) {
      dispatch(removeFavoritePlayer(player.id));
    } else {
      dispatch(addFavoritePlayer(player));
    }
  }, [dispatch, favorites]);

  if (loading) return <div className={styles.loadingMessage}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.listContainer}>
      {list.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          type={'other'}
          onAddFavorite={() => handleToggleFavorite(player)}
        />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        perPage={perPage}
        totalCount={totalCount}
      />
    </div>
  );
};
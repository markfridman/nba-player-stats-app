import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchTerm } from '../store/playersSlice';
import { PlayerSearch } from './PlayerSearch';
import { PlayerList } from './PlayerList';
import { debounce } from 'lodash';
import styles from './PlayerManagement.module.css';

export const PlayerManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.players);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(setSearchTerm(term));
      // dispatch(setCurrentPage(1));
    }, 300),
    [dispatch]
  );

  const handleSearch = useCallback((term: string) => {
    setLocalSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NBA Player Stats</h1>
      <div className={styles.searchContainer}>
        <PlayerSearch searchTerm={localSearchTerm} onSearch={handleSearch} />
      </div>
      <PlayerList />
    </div>
  );
};
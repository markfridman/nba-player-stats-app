import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { PlayerManagement } from './components/PlayerManagement';
import { FavoritePlayerList } from './components/FavoritePlayerList';
import styles from './App.module.css';

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <div className={styles.appContainer}>
        <h1 className={styles.appTitle}>NBA Player Stats</h1>
        <div className={styles.contentWrapper}>
          <div className={styles.playerManagementSection}>
            <PlayerManagement />
          </div>
          <div className={styles.favoritePlayersSection}>
            <FavoritePlayerList />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
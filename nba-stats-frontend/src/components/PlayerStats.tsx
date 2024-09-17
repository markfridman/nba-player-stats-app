import React from 'react';
import { PlayerStats as PlayerStatsType } from '../interfaces/PlayerStats';
import styles from './PlayerStats.module.css';

interface PlayerStatsProps {
  stats: PlayerStatsType | null;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats }) => {
  if (!stats) return <div className={styles.loadingStats}>Loading stats...</div>;

  return (
    <div className={styles.statsContainer}>
      <h4 className={styles.statTitle}>Season Averages</h4>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Games Played:</span>
        <span className={styles.statValue}>{stats.games_played}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Points:</span>
        <span className={styles.statValue}>{stats.pts.toFixed(1)}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Rebounds:</span>
        <span className={styles.statValue}>{stats.reb.toFixed(1)}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Assists:</span>
        <span className={styles.statValue}>{stats.ast.toFixed(1)}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Steals:</span>
        <span className={styles.statValue}>{stats.stl.toFixed(1)}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Blocks:</span>
        <span className={styles.statValue}>{stats.blk.toFixed(1)}</span>
      </div>
    </div>
  );
};
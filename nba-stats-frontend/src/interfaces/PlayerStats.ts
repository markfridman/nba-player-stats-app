export interface PlayerStats {
  player_id: number;
  season: number;
  games_played: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  min: string;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  oreb: number;
  dreb: number;
  turnover: number;
  pf: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
}

export interface PlayerStatsApiResponse {
  data: PlayerStats;
}
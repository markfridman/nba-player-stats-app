import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Player, PlayerApiResponse } from '../interfaces/Player';
import { PlayerStats } from '../interfaces/PlayerStats';
import { getCachedData, setCachedData } from '../services/cacheService';
import { mockPlayers, mockPlayerStats } from '../mocks/playerData';
import {
  PlayerNotFoundException,
  ExternalApiException,
  InvalidInputException,
} from '../common/exceptions/custom-exceptions';
// import { fetchPlayers } from './example';

@Injectable()
export class PlayerService {
  private readonly API_BASE_URL: string;
  private readonly API_KEY: string;
  private readonly logger = new Logger(PlayerService.name);
  private readonly USE_MOCK_DATA: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_BASE_URL = this.configService.get<string>('API_BASE_URL');
    this.API_KEY = this.configService.get<string>('BALLDONTLIE_API_KEY');
    this.USE_MOCK_DATA =
      this.configService.get<string>('USE_MOCK_DATA') === 'true';

    this.logger.log(`API_BASE_URL: ${this.API_BASE_URL}`);
    this.logger.log(`API_KEY is ${this.API_KEY ? 'set' : 'not set'}`);
  }

  getPlayers(
    search: string,
    page: number,
    perPage: number,
  ): Observable<PlayerApiResponse> {
    if (page < 1 || perPage < 1) {
      throw new InvalidInputException(
        'Page and perPage must be positive integers',
      );
    }
    if (this.USE_MOCK_DATA) {
      const filteredPlayers = mockPlayers.filter(
        (player) =>
          player.first_name.toLowerCase().includes(search.toLowerCase()) ||
          player.last_name.toLowerCase().includes(search.toLowerCase()),
      );

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

      return of({
        data: paginatedPlayers,
        meta: {
          // total_pages: Math.ceil(filteredPlayers.length / perPage),
          // current_page: page,
          next_page: page * perPage < filteredPlayers.length ? page + 1 : null,
          per_page: perPage,
          // total_count: filteredPlayers.length,
        },
      } as unknown as PlayerApiResponse);
    }

    const cacheKey = `players_${search}_${page}_${perPage}`;
    const cachedData = getCachedData<{ data: Player[]; meta: any }>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    this.logger.debug(`Fetching players from: ${this.API_BASE_URL}/players`);
    // fetchPlayers(search)
    return this.httpService
      .get(`${this.API_BASE_URL}/players`, {
        params: { search, per_page: perPage },
        headers: { Authorization: this.API_KEY },
      })
      .pipe(
        map((response) => {
          console.log(response.data);
          return response.data;
        }),
        tap((data) => setCachedData(cacheKey, data)),
        catchError((error) => {
          this.logger.error('Error fetching players:', error.message);
          throw new ExternalApiException(
            'Failed to fetch players from external API',
          );
        }),
      );
  }

  getPlayerStats(playerId: number): Observable<PlayerStats> {
    if (playerId < 1) {
      throw new InvalidInputException('Player ID must be a positive integer');
    }

    const currentYear = new Date().getFullYear();
    if (this.USE_MOCK_DATA) {
      return of(mockPlayerStats[playerId]);
    }

    const cacheKey = `player_stats_${playerId}`;
    const cachedData = getCachedData<PlayerStats>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    this.logger.debug(
      `Fetching player stats from: ${this.API_BASE_URL}/season_averages`,
    );

    return this.httpService
      .get(`${this.API_BASE_URL}/season_averages`, {
        params: { player_ids: [playerId], season: currentYear - 1 },
        headers: { Authorization: this.API_KEY },
      })
      .pipe(
        map((response) => {
          if (response.data.data.length === 0) {
            throw new PlayerNotFoundException(playerId);
          }
          return response.data.data[0];
        }),
        tap((data) => setCachedData(cacheKey, data)),
        catchError((error) => {
          if (error instanceof PlayerNotFoundException) {
            throw error;
          }
          this.logger.error('Error fetching player stats:', error.message);
          throw new ExternalApiException(
            'Failed to fetch player stats from external API',
          );
        }),
      );
  }
}

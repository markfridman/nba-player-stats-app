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
    page: string,
    perPage: string,
  ): Observable<PlayerApiResponse> {
    const pageInt = parseInt(page, 10);
    const perPageInt = parseInt(perPage, 10);
    if (pageInt < 1 || perPageInt < 1) {
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

      const startIndex = (pageInt - 1) * perPageInt;
      const endIndex = startIndex + perPageInt;
      const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

      return of({
        data: paginatedPlayers,
        meta: {
          total_pages: Math.ceil(filteredPlayers.length / perPageInt),
          current_page: pageInt,
          next_page:
            pageInt * perPageInt < filteredPlayers.length ? pageInt + 1 : null,
          per_page: perPageInt,
          total_count: filteredPlayers.length,
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

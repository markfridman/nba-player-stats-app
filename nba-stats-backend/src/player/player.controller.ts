import { Controller, Get, Query } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayers(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('per_page') perPage: number,
  ) {
    return this.playerService.getPlayers(search, page, perPage);
  }

  @Get('stats')
  async getPlayerStats(@Query('player_id') playerId: number) {
    return this.playerService.getPlayerStats(playerId);
  }
}

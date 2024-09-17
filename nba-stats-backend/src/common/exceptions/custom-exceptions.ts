import { HttpException, HttpStatus } from '@nestjs/common';

export class PlayerNotFoundException extends HttpException {
  constructor(playerId: number) {
    super(`Player with ID ${playerId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ExternalApiException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_GATEWAY);
  }
}

export class InvalidInputException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

# NBA Stats Backend

This is the backend server for the NBA Stats project. It provides API endpoints to fetch NBA player data and statistics.

## Technologies Used

- NestJS
- TypeScript
- Axios

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/nba-stats-backend.git
   cd nba-stats-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
    API_BASE_URL=https://www.balldontlie.io/api/v1
    BALLDONTLIE_API_KEY=YOUR_API_KEY
    USE_MOCK_DATA=false
   ```

4. Start the development server:
   ```
   npm run start:dev
   ```

5. The server will be running at `http://localhost:3000`.

## Available Scripts

- `npm run start`: Starts the server
- `npm run start:dev`: Starts the server in watch mode
- `npm run start:prod`: Starts the server in production mode
- `npm run lint`: Runs the linter
- `npm run test`: Runs the test suite

## API Endpoints

- `GET /players`: Fetch a list of NBA players
  - Query parameters:
    - `search`: Search term for player names
    - `page`: Page number for pagination
    - `per_page`: Number of results per page

- `GET /players/stats`: Fetch stats for a specific player
  - Query parameters:
    - `player_id`: ID of the player

## License

This project is licensed under the MIT License.
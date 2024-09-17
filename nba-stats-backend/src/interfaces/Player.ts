export interface Team {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: Team;
}

export interface PlayerApiResponse {
  data: Player[];
  meta: {
    current_page: number;
    next_page: number | null;
    per_page: string;
    total_pages: number;
    total_count: number;
  };
}

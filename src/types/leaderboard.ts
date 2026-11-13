export interface LocalScoreEntry {
  gameId: string;
  score: number;
  title?: string;
  category?: string;
  slug?: string;
}

export interface LeaderboardEntry {
  id?: number;
  gameId: string;
  playerName?: string;
  score: number;
  createdAt?: string;
}

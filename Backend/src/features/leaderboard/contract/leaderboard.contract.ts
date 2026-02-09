import LeaderboardRow from '../interface/Leaderboard.interface';

export default abstract class LeaderboardContract {
  abstract getLeaderBoard(limit: number, offset: number): Promise<LeaderboardRow[]>
}
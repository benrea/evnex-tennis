 /**
  * Points
  * Games
  * Sets
  */

// Scores from zero to three points are described as 0, 15, 30, 40, respectively
 const SCORES = [
     0,
     15,
     30,
     40
 ]

 const ADVANTAGE_MIN_POINTS = 3;
 const DEUCE_MIN_POINTS = 3;

 const MIN_POINTS_IN_GAME = 4;
 const MIN_POINTS_DIFF_IN_GAME = 2;

 const MIN_GAMES_IN_SET = 6;
 const MIN_GAMES_DIFF_IN_SET = 2;

export class Match {
    private _playerPoints: {[playerName: string]: number};
    private _playerGames: {[playerName: string]: number};
    private _winner: string;

    constructor(
        private _player1Name: string,
        private _player2Name: string
    ) {
        this._playerPoints = {
            [_player1Name]: 0,
            [_player2Name]: 0
        };
        this._playerGames = {
            [_player1Name]: 0,
            [_player2Name]: 0
        };
    }

    // returns the current set score followed by the current game score
    public score(): string {
        return this._winner
            ? `${this._winner} wins the set`
            : `${this.getGameScore()}, ${this.getPointScore()}`
    }

    private getGameScore(): string {
        const player1Games = this._playerGames[this._player1Name];
        const player2Games = this._playerGames[this._player2Name];
        return `${player1Games}-${player2Games}`;
    }

    private getPointScore(): string {
        const player1Points = this._playerPoints[this._player1Name];
        const player2Points = this._playerPoints[this._player2Name];

        // Deuce
        if (player1Points == player2Points && player1Points >= DEUCE_MIN_POINTS) {
            return 'Deuce';
        }

        const playerPointsMin = Math.min(player1Points, player2Points);
        const playerPointsMax = Math.max(player1Points, player2Points);
        const playerPointsDiff = playerPointsMax - playerPointsMin;
        
        // Advantage
        if (playerPointsMin >= ADVANTAGE_MIN_POINTS && playerPointsDiff == 1) {
            const playerWithAdvantage = player1Points == playerPointsMax
                ? this._player1Name
                : this._player2Name;
            return `Advantage ${playerWithAdvantage}`;
        }

        // Running score
        if (playerPointsMax < SCORES.length) {
            return `${SCORES[player1Points]}-${SCORES[player2Points]}`;
        }

        // Exception
        return null;
    }

    // Indicates who won the point
    public pointWonBy(playerName: string): void {
        this._playerPoints[playerName]++;
        if (this._playerPoints[playerName] < MIN_POINTS_IN_GAME) {
            return;
        }

        // Game won
        const playerPointsDiff = Math.abs(this._playerPoints[this._player1Name] - this._playerPoints[this._player2Name]);
        if (playerPointsDiff >= MIN_POINTS_DIFF_IN_GAME) {
            this._playerGames[playerName]++;
            this._playerPoints[this._player1Name] = 0;
            this._playerPoints[this._player2Name] = 0;
        }
        if (this._playerGames[playerName] < MIN_GAMES_IN_SET) {
            return;
        }

        // Set won
        const playerGamesDiff = Math.abs(this._playerGames[this._player1Name] - this._playerGames[this._player2Name]);
        if (playerGamesDiff >= MIN_GAMES_DIFF_IN_SET) {
            this._winner = playerName;
        }

        // TODO: Tie game
    }
}
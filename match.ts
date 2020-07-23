/** Tennis definitions
 * Match: A match has one set and a set has many games.
 * Game: A game is won by the first player to have won at least 4 points in total and at least 2 points more than the opponent.
 * Point: won per game
 * Set: A player wins a set by winning at least 6 games and at least 2 games more than the opponent.
 */ 

// Scores from zero to three points are described as 0, 15, 30, 40, respectively
 const SCORES = [
     0,
     15,
     30,
     40
 ]

export class Match {
    private _playerPoints: {[key: string]: number};

    constructor(
        private _player1Name: string,
        private _player2Name: string
    ) {
        this._playerPoints = {
            [_player1Name]: 0,
            [_player2Name]: 0
        };
    }

    // returns the current set score followed by the current game score
    public score(): string {
        const player1Points = this._playerPoints[this._player1Name];
        const player2Points = this._playerPoints[this._player2Name];

        const player1Score = SCORES[player1Points];
        const player2Score = SCORES[player2Points];

        // todo: deuce

        // todo: advantage

        return `0-0, ${player1Score}-${player2Score}`;
    }

    // indicates who won the point
    public pointWonBy(playerName: string): void {
        this._playerPoints[playerName] = (this._playerPoints[playerName]) + 1;

        // todo: set win
    }
}
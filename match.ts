//#region Constants
// Scores from zero to three points are described as 0, 15, 30, 40, respectively
 const SCORES = [
     0,
     15,
     30,
     40
 ]
 const MIN_ADVANTAGE_POINTS = 3;
 const ADVANTAGE_POINTS_MARGIN = 1;
 const MIN_DEUCE_POINTS = 3;
 const MIN_POINTS_IN_GAME = 4;
 const MIN_POINTS_MARGIN_IN_GAME = 2;
 const MIN_POINTS_IN_TIE_GAME = 7;
 const MIN_POINTS_MARGIN_IN_TIE_GAME = 2;
 const MIN_GAMES_IN_SET = 6;
 const MIN_GAMES_MARGIN_IN_SET = 2;
 const MIN_GAMES_MARGIN_IN_TIE = 1;
 //#endregion

export class Match {
    private _playerPoints: {[playerName: string]: number};
    private _playerGames: {[playerName: string]: number};
    private _winner: string;
    private _isTieGame: boolean = false;

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
            ? `${this._winner} wins the ${this._isTieGame ? 'tie' : 'set'}`
            : `${this.getSetScore()}, ${this.getGameScore()}`
    }

    private getSetScore(): string {
        const player1Games = this._playerGames[this._player1Name];
        const player2Games = this._playerGames[this._player2Name];
        return `${player1Games}-${player2Games}`;
    }

    private getGameScore(): string {
        const player1Points = this._playerPoints[this._player1Name];
        const player2Points = this._playerPoints[this._player2Name];

        // Deuce
        if (player1Points == player2Points && player1Points >= MIN_DEUCE_POINTS) {
            return 'Deuce';
        }

        const playerPointsMin = Math.min(player1Points, player2Points);
        const playerPointsMax = Math.max(player1Points, player2Points);
        const playerPointsMargin = playerPointsMax - playerPointsMin;
        
        // Advantage
        if (playerPointsMin >= MIN_ADVANTAGE_POINTS && playerPointsMargin == ADVANTAGE_POINTS_MARGIN) {
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
        const playerPointsMargin = Math.abs(this._playerPoints[this._player1Name] - this._playerPoints[this._player2Name]);

        const minPoints = this._isTieGame
            ? MIN_POINTS_IN_TIE_GAME
            : MIN_POINTS_IN_GAME;
        
        const minPointsMargin = this._isTieGame
            ? MIN_POINTS_MARGIN_IN_TIE_GAME
            : MIN_POINTS_MARGIN_IN_GAME;

        // Play on
        if (this._playerPoints[playerName] < minPoints ||
            playerPointsMargin < minPointsMargin) {
            return;
        }

        return this.gameWonBy(playerName)
    }

    // Indicates who won the game
    private gameWonBy(playerName: string) {
        this._playerGames[playerName]++;
        this._playerPoints[this._player1Name] = 0;
        this._playerPoints[this._player2Name] = 0;

        // Play on
        if (this._playerGames[playerName] < MIN_GAMES_IN_SET) {
            return;
        }

        // Set tie game
        if (this._playerGames[this._player1Name] == this._playerGames[this._player2Name]) {
            this._isTieGame = true;
        }

        const playerGamesMargin = Math.abs(this._playerGames[this._player1Name] - this._playerGames[this._player2Name]);
        const minGamesMargin = this._isTieGame
            ? MIN_GAMES_MARGIN_IN_TIE
            : MIN_GAMES_MARGIN_IN_SET;

        // Play on
        if (playerGamesMargin < minGamesMargin) {
            return;
        }

        this.setWonBy(playerName);
    }

    // Indicates who won the set
    private setWonBy(playerName: string) {
        this._winner = playerName;
    }
}
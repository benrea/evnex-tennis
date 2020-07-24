import { Player } from "./player";

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
 const MIN_SETS_IN_MATCH = 1;
 const MIN_SETS_MARGIN_IN_MATCH = 1;
 //#endregion

export class Match {
    private _players: {[playerName: string]: Player};
    private get _player1(): Player {
        return this._players[this._player1Name];
    }
    private get _player2(): Player {
        return this._players[this._player2Name];
    }

    private _winner: Player;
    private _isTieGame: boolean = false;

    constructor(
        private _player1Name: string,
        private _player2Name: string
    ) {
        this._players = {
            [_player1Name]: new Player(_player1Name),
            [_player2Name]: new Player(_player2Name)
        }
    }

    // returns the current set score followed by the current game score
    public score(): string {
        return this._winner
            ? `${this._winner.name} wins the ${this._isTieGame ? 'tie' : 'set'}`
            : `${this.getSetScore()}, ${this.getGameScore()}`
    }

    private getSetScore(): string {
        return `${this._player1.games}-${this._player2.games}`;
    }

    private getGameScore(): string {
        // Deuce
        if (this._player1.points == this._player2.points && this._player1.points >= MIN_DEUCE_POINTS) {
            return 'Deuce';
        }

        const playerPointsMin = Math.min(this._player1.points, this._player2.points);
        const playerPointsMax = Math.max(this._player1.points, this._player2.points);
        const playerPointsMargin = playerPointsMax - playerPointsMin;
        
        // Advantage
        if (playerPointsMin >= MIN_ADVANTAGE_POINTS && playerPointsMargin == ADVANTAGE_POINTS_MARGIN) {
            const playerWithAdvantage = this._player1.points == playerPointsMax
                ? this._player1
                : this._player2;
            return `Advantage ${playerWithAdvantage.name}`;
        }

        // Running score
        if (playerPointsMax < SCORES.length) {
            return `${SCORES[this._player1.points]}-${SCORES[this._player2.points]}`;
        }

        // Exception
        return null;
    }

    // Indicates who won the point
    public pointWonBy(playerName: string): void {
        const player = this._players[playerName];
        player.points++;
        const playerPointsMargin = Math.abs(this._player1.points - this._player2.points);

        const minPoints = this._isTieGame
            ? MIN_POINTS_IN_TIE_GAME
            : MIN_POINTS_IN_GAME;
        
        const minPointsMargin = this._isTieGame
            ? MIN_POINTS_MARGIN_IN_TIE_GAME
            : MIN_POINTS_MARGIN_IN_GAME;

        // Not enough points scored, or
        // not enough margin to win, play on
        if (player.points < minPoints ||
            playerPointsMargin < minPointsMargin) {
            return;
        }

        return this.gameWonBy(player)
    }

    // Indicates who won the game
    private gameWonBy(player: Player) {
        player.games++;
        this._player1.points = 0;
        this._player2.points = 0;

        // Not enough games played, play on
        if (player.games < MIN_GAMES_IN_SET) {
            return;
        }

        // Set tie game, play on
        if (this._player1.games == this._player2.games) {
            this._isTieGame = true;
            return;
        }

        const playerGamesMargin = Math.abs(this._player1.games - this._player2.games);
        const minGamesMargin = this._isTieGame
            ? MIN_GAMES_MARGIN_IN_TIE
            : MIN_GAMES_MARGIN_IN_SET;

        // Not enough margin to win, play on
        if (playerGamesMargin < minGamesMargin) {
            return;
        }

        this.setWonBy(player);
    }

    // Indicates who won the set
    private setWonBy(player: Player) {
        this._winner = player;
    }
}
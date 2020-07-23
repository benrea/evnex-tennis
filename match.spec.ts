import { Match } from "./match";

describe('tennis', () => {
    describe('score', () => {
        it('should return "0-0, 0-0" for new match', () => {
            const match = new Match('player 1', 'player 2');
            expect(match.score()).toEqual('0-0, 0-0');
        });

        it('should return "0-0, 15-15" for first example', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            expect(match.score()).toEqual('0-0, 15-15');
        });

        it('should return "0-0, 40-15" for second example', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            expect(match.score()).toEqual('0-0, 40-15');
        });

        it('should return "0-0, Deuce" for deuce example', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 2");
            expect(match.score()).toEqual('0-0, Deuce');
        });

        it('should return "0-0, Advantage player 1" for advantage example', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            expect(match.score()).toEqual('0-0, Advantage player 1');
        });

        it('should return "1-0, 0-0" after game won', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            expect(match.score()).toEqual('1-0, 0-0');
        });
        
        it('should return "player 1 wins the set" after set won', () => {
            const points = 4;
            const games = 6;
            const rounds = points * games;
            const match = new Match('player 1', 'player 2');
            for(var r = 0; r < rounds; r++) {
                match.pointWonBy("player 1");
            }
            expect(match.score()).toEqual('player 1 wins the set');
        });
        
        it('should return "player 1 wins the tie" after tie game', () => {
            const points = 4;
            const games = 6;
            const tie_points = 7;
            const match = new Match('player 1', 'player 2');

            // Play to tie game 6-6, 0-0
            for(var g = 0; g < games; g++) {
                for(var p = 0; p < points; p++) {
                    match.pointWonBy("player 1");
                }
                for(var p = 0; p < points; p++) {
                    match.pointWonBy("player 2");
                }
            }
            // Win the tie game 6-6, 7-0 => 7,6
            for(var t = 0; t < tie_points; t++) {
                match.pointWonBy("player 1");
            }

            expect(match.score()).toEqual('player 1 wins the tie');
        });
        
        it('should return "0-0, null" when points exceed running scores', () => {
            const match = new Match('player 1', 'player 2');
            (<any>match)._playerPoints['player 1'] = 4;
            expect(match.score()).toEqual('0-0, null');
        });
    });

    describe('pointWonBy', () => {
        it('should award a point to the victor', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy('player 1');
            expect((<any>match)._playerPoints['player 1']).toEqual(1);
        });

        it('should award a game to the victor', () => {
            const points = 4;
            const match = new Match('player 1', 'player 2');
            for(var p = 0; p < points; p++) {
                match.pointWonBy("player 1");
            }
            expect((<any>match)._playerGames['player 1']).toEqual(1);
        });

        it('should award a set to the victor', () => {
            const match = new Match('player 1', 'player 2');
            (<any>match)._playerPoints['player 1'] = 3;
            (<any>match)._playerGames['player 1'] = 5;

            match.pointWonBy('player 1');

            expect((<any>match)._winner).toEqual('player 1');
        });
        
        it('should set isTieGame to true when 6-6', () => {
            const match = new Match('player 1', 'player 2');
            (<any>match)._playerPoints['player 1'] = 3;
            (<any>match)._playerGames['player 1'] = 5;
            (<any>match)._playerGames['player 2'] = 6;

            match.pointWonBy("player 1");

            expect((<any>match)._isTieGame).toBe(true);
            expect(match.score()).toBe('6-6, 0-0');
        });

        it('should award a tie game to the victor', () => {
            const match = new Match('player 1', 'player 2');
            (<any>match)._playerPoints['player 1'] = 6;
            (<any>match)._playerGames['player 1'] = 6;
            (<any>match)._playerGames['player 2'] = 6;
            (<any>match)._isTieGame = true;

            match.pointWonBy("player 1");

            expect((<any>match)._winner).toEqual('player 1');
        });
    });
});
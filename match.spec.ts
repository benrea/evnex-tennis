import { Match } from "./match";

describe('tennis', () => {
    describe('score', () => {
        it('should return "0-0, 0-0" for new match', () => {
            const match = new Match('player 1', 'player 2');
            expect(match.score()).toEqual('0-0, 0-0');
        });

        it('should return "0-0, 15-15" for first game', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            expect(match.score()).toEqual('0-0, 15-15');
        });

        it('should return "0-0, 40-15" for second game', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            expect(match.score()).toEqual('0-0, 40-15');
        });

        it('should return "0-0, Deuce" for match deuce', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 1");
            match.pointWonBy("player 1");
            match.pointWonBy("player 2");
            match.pointWonBy("player 2");
            expect(match.score()).toEqual('0-0, Deuce');
        });

        xit('should return "0-0, Advantage player 1" for match advantage', () => {
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

        xit('should return "1-0, 0-0" after set won', () => {
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

    });

    describe('pointWonBy', () => {
        it('should award a point to the victor', () => {
            const match = new Match('player 1', 'player 2');
            match.pointWonBy('player 1');
            expect((<any>match)._playerPoints['player 1']).toEqual(1);
        });
    });
});
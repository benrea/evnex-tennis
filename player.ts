export class Player {
    public name: string;
    public points: number;
    public games: number;
    public sets: number;

    constructor(name: string) {
        this.name = name;
        this.points = 0;
        this.games = 0;
        this.sets = 0;
    }
}
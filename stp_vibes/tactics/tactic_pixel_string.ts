import * as World from "base/world";
import { FriendlyRobot, Robot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Vector } from "base/vector";


export class TacticPixelString {

    private robots: FriendlyRobot[];
    private letters: string[];
    private source: string;
    private spacing: number = 1;

    constructor(robots: FriendlyRobot[], source: string) {
        this.robots = robots;
        this.source = source;
        this.letters = [
            "10001\n00000\n00000\n00000\n10001",
        ];
    }

    public run() {
        this.source.split("").forEach((letter: string) => {
            const letterString = this.letters[letter.charCodeAt(0) - 97]
            const lines = letterString.split("\n");
            const matrix = lines.map((line) => Array.from(line).map((c) => c === "0" ? false : true).reverse()).reverse();
            this.renderLetter(matrix);
        });
    }

    renderLetter(pixels: boolean[][]) {
        const coordinates: [number, number][] = [];

        // Filter all coordinates to display
        pixels.forEach((column, x) => {
            column.forEach((_, y) => {
                if (pixels[x][y]) {
                    coordinates.push([x, y]);
                }
            });
        })

        // Display the coordinates
        coordinates.forEach((coordinate, index) => {
            if (index < this.robots.length) {
                const skill = new MoveTo(this.robots[index]);
                const x = (coordinate[0] * this.spacing - (pixels.length - 1) / 2 * this.spacing); // check if -1 is only for even numbers of pixels
                const y = (coordinate[1] * this.spacing - (pixels[0].length - 1) / 2 * this.spacing);
                skill.run(new Vector(x, y), 0);
            }
        });
    }

}
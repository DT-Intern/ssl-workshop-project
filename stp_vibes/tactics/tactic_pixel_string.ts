import * as World from "base/world";
import { FriendlyRobot, Robot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Vector } from "base/vector";
import { isConstructorDeclaration } from "typescript";


export class TacticPixelString {

    private robots: FriendlyRobot[];
    private letters: string[];
    private queue: string[];
    private source: string;
    private spacing: number = 0.5;
    private delay: number = 1;

    // Custom timer
    static timeDiff: number = 0;
    static currentIndex: number = 0;

    constructor(robots: FriendlyRobot[], source: string, delay: number) {
        this.robots = robots;
        this.source = source;
        this.delay = delay;
        this.letters = [
            "01110\n10001\n10001\n11111\n10001",
            "11110\n10001\n11110\n10001\n11110",
            "11111\n10001\n10000\n10000\n11111",
            "11110\n10001\n10001\n10001\n11110",
            "01111\n10000\n11111\n10000\n01111",
            "01111\n10000\n11111\n10000\n10000",
            "01111\n10000\n10111\n10001\n01111",
            "10001\n10001\n11111\n10001\n10001",
            "11011\n00100\n00100\n00100\n11111",
            "01111\n00001\n10001\n10001\n01110",
            "10001\n10010\n11100\n10010\n10001",
            "10000\n10000\n10000\n10000\n01110",
            "10001\n11011\n10101\n10101\n10001",
            "10001\n11001\n10101\n10011\n10001",
            "01110\n10001\n10001\n10001\n01110",
            "01110\n10001\n10001\n11110\n10000",
            "01110\n10001\n10001\n01110\n00100",
            "11110\n10001\n11110\n10001\n10001",
            "01111\n10000\n01111\n00001\n11110",
            "11111\n00100\n00100\n00100\n00100",
            "10001\n10001\n10001\n10001\n01110",
            "10001\n10001\n10001\n01010\n00100",
            "10001\n10001\n10101\n10101\n01010",
            "10001\n01010\n00100\n01010\n10001",
            "10001\n10001\n01010\n00100\n01000",
            "11111\n00010\n00100\n01000\n11111",
        ];

        this.queue = this.source.toLowerCase().split("").map((letter: string) => this.letters[letter.charCodeAt(0) - 97]);
    }

    public run() {
        if (this.queue) {
            TacticPixelString.timeDiff += World.TimeDiff;
            amun.log(TacticPixelString.timeDiff)

            if (TacticPixelString.timeDiff > this.delay) {
                TacticPixelString.timeDiff = 0;

                if (TacticPixelString.currentIndex < this.queue.length - 1) {
                    TacticPixelString.currentIndex += 1;
                } else {
                    TacticPixelString.currentIndex = 0;
                }
            }

            const lines = this.queue[TacticPixelString.currentIndex].split("\n");
            const matrix = lines.map((line) => Array.from(line).map((c) => c === "0" ? false : true).reverse()).reverse();
            this.renderLetter(matrix);
        }
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

        const positions: Vector[] = [];
        for (let i = coordinates.length; i < this.robots.length; i++) {
            const rad = (i - coordinates.length) / (this.robots.length - coordinates.length) * 2 * Math.PI;
            const [x, y] = [Math.cos(rad) * 3, Math.sin(rad) * 3];
            positions.push(new Vector(x, y));
        }
        for (let i = coordinates.length; i < this.robots.length; i++) {
            const closest = positions.sort((a, b) => (b.distanceToSq(this.robots[i].pos) - a.distanceToSq(this.robots[i].pos))).pop() ?? new Vector(0, 0);
            // new MoveTo(this.robots[i]).run(new Vector(-4 + i * 0.3, -6), 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
            new MoveTo(this.robots[i]).run(closest, 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
        }
    }

}
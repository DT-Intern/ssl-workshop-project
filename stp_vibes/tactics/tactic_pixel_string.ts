import * as World from "base/world";
import { FriendlyRobot, Robot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Vector } from "base/vector";
// import { isConstructorDeclaration } from "typescript";


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

    // robot index assignments
    static assignments: [number, number][] = [];
    static assignNewPositions = true;

    // circle offset
    static circleDelta = 0;

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
            TacticPixelString.circleDelta = (TacticPixelString.circleDelta + World.TimeDiff) % 1e9;
            TacticPixelString.timeDiff += World.TimeDiff;
            amun.log(TacticPixelString.timeDiff)

            if (TacticPixelString.timeDiff > this.delay) {
                TacticPixelString.timeDiff = 0;

                if (TacticPixelString.currentIndex < this.queue.length - 1) {
                    TacticPixelString.currentIndex += 1;
                    TacticPixelString.assignNewPositions = true;
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
        const positions: Vector[] = [];
        const freeRobots = this.robots;

        // Filter all coordinates to display
        pixels.forEach((column, x) => {
            column.forEach((_, y) => {
                if (pixels[x][y]) {
                    positions.push(new Vector(
                        (x * this.spacing - (pixels.length - 1) / 2 * this.spacing),
                        (y * this.spacing - (pixels[0].length - 1) / 2 * this.spacing)
                    ));
                }
            });
        })

        // Display the coordinates
        // positions.forEach((coordinate, index) => {
        //     if (index < this.robots.length) {
        //         const skill = new MoveTo(this.robots[index]);
        //         skill.run(coordinate, 0);
        //     }
        // });

        const numIdle = this.robots.length - positions.length;
        for (let i = 0; i < numIdle; i++) {
            const rad = i / numIdle * 2 * Math.PI;
            const [x, y] = [Math.cos(rad + TacticPixelString.circleDelta / 5) * 3, Math.sin(rad + TacticPixelString.circleDelta / 5) * 3];
            positions.push(new Vector(x, y));
        }

        if (TacticPixelString.assignNewPositions) {
            const indexedRobotPositions = this.robots.map((robot, index): [number, Vector] => ([index, robot.pos]));
            TacticPixelString.assignments = positions
                .map((position, index): [number, number] => ([
                    index,
                    indexedRobotPositions
                        .sort(([_robotAIndex, robotAPosition], [_robotBIndex, robotBPosition]) =>
                            robotBPosition.distanceTo(position) - robotAPosition.distanceTo(position))
                        .pop()![0]
                ])
            );
            TacticPixelString.assignNewPositions = false;
        }
        amun.log(TacticPixelString.assignments)

        for (const assignment of TacticPixelString.assignments) {
	    amun.log(assignment[0]);
	    amun.log(assignment[1]);
	    amun.log("---");
	    const targetRobot = this.robots[assignment[1]];
	    if (targetRobot) {
	    	new MoveTo(targetRobot).run(positions[assignment[0]], 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
	    }
            // new MoveTo(this.robots[assignment[1]]).run(positions[assignment[0]], 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
        }

        // const numTotal = positions.length;
        // for (let i = 0; i < numTotal - numIdle; i++) {
        //     // new MoveTo(this.robots[i]).run(new Vector(-4 + i * 0.3, -6), 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
        // }
        
        // for (let i = numTotal - numIdle; i < numTotal; i++) {
        //     const closest = positions.filter((_, index) => index >= numTotal - numIdle).sort((a, b) => (b.distanceToSq(this.robots[i].pos) - a.distanceToSq(this.robots[i].pos))).pop() ?? new Vector(0, 0);
        //     new MoveTo(this.robots[i]).run(closest, 0, undefined, undefined, { ignoreBall: true, ignoreGoals: true, ignoreDefenseArea: true });
        // }
    }

}

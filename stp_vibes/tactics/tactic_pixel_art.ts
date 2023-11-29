import * as World from "base/world";
import { FriendlyRobot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Vector } from "base/vector";


export class TacticPixelDisplay {

    private robots: FriendlyRobot[];
    private pixels: boolean[][];

    private spacing: number = 1;

    constructor(robots: FriendlyRobot[], pixels: boolean[][]) {
        this.robots = robots;
        this.pixels = pixels;
    }

    public run() {
        const coordinates: [number, number][] = [];

        // Filter all coordinates to display
        this.pixels.forEach((column, x) => {
            column.forEach((row, y) => {
                if (this.pixels[x][y]) {
                    coordinates.push([x, y]);
                }
            });
        })

        // Display the coordinates
        coordinates.forEach((coordinate, index) => {
            if (index < this.robots.length) {
                const skill = new MoveTo(this.robots[index]);
                const x = (coordinate[0] * this.spacing - coordinates.length / 2 * this.spacing);
                const y = (coordinate[1] * this.spacing - coordinates.length / 2 * this.spacing);
                skill.run(new Vector(x, y), 0);
            }
        });
    }

}
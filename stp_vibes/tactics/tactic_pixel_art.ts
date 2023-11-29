import * as World from "base/world";
import { FriendlyRobot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Vector } from "base/vector";


export class TacticPixelDisplay {

    private robots: FriendlyRobot[];
    private pixels: boolean[][];
    private dimensions: [number, number];

    private spacing: number = 1;

    constructor(robots: FriendlyRobot[], pixels: boolean[][], dimensions: [number, number]) {
        this.robots = robots;
        this.pixels = pixels;
        this.dimensions = dimensions;
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
                const x = (coordinate[0] * this.spacing - (this.pixels.length - 1) / 2 * this.spacing); // check if -1 is only for even numbers of pixels
                const y = (coordinate[1] * this.spacing - (this.pixels[0].length - 1) / 2 * this.spacing);
                skill.run(new Vector(x, y), 0);
            }
        });
    }

}
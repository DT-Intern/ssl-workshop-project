import * as World from "base/world";
import { FriendlyRobot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";

export class TacticSinewave {

    private robots: FriendlyRobot[];

    constructor(robots: FriendlyRobot[]) {
        this.robots = robots;
    }

    public run() {
        this.robots.forEach((robot, index, robots) => {
            const skill = new MoveTo(robot);
            const amplitude = 4;
            const x = (index + 0.5) - robots.length / 2;
            const y = amplitude * Math.sin(World.Time * Math.PI + index);
            skill.run(new Vector(y, x), 0);
        });
    }

}
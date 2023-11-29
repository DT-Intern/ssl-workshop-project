import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { FriendlyRobot } from "base/robot";
import { Ball } from "base/ball";
import { Tacticone } from "stp_vibes/tactics/tacticone";
import { TacticSinewave } from "stp_vibes/tactics/tactic_sinewave";

export class Penalty {

    state: number = 0;

    constructor() {

    }

    run() {
        this.runPenalty(World.FriendlyRobots[0]);
    }

    runPenalty(robot: FriendlyRobot) {
        if (World.Ball.pos.distanceTo(robot.pos) < 5.1) {
            amun.log("Switching state");
            this.state = 1;
        }

        if (this.state === 0) {
            const moveTo = new MoveTo(robot);
            moveTo.run(new Vector(0, 0), 0);
            robot.shootDisable();
            robot.setDribblerSpeed(1.0);
        } else if (this.state === 1) {
            const moveAway = new MoveTo(robot);
            moveAway.run(new Vector(0, 3), 0);
        }
    }

}

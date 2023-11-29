import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { Ball } from "base/ball";
import { Tacticone } from "stp_vibes/tactics/tacticone";
import { TacticSinewave } from "stp_vibes/tactics/tactic_sinewave";
import { TacticPixelDisplay } from "stp_vibes/tactics/tactic_pixel_art";

export class Game {

	constructor() {

	}

	run() {
		amun.log("Game Play loop");

		const display = new TacticPixelDisplay(World.FriendlyRobots, [
			[true, false, false],
			[false, true, false],
			[false, false, true],
		]);
		display.run();
	}
}

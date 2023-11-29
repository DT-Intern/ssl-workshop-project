import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { Ball } from "base/ball";
import { Tacticone } from "stp_vibes/tactics/tacticone";
import { TacticSinewave } from "stp_vibes/tactics/tactic_sinewave";

export class Game {

	constructor() {

	}

	run() {
		amun.log("Game Play loop");

		const sine_wave = new TacticSinewave(World.FriendlyRobots);
		sine_wave.run();
	}
}

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

		// const image = "00000\n00111\n01100\n01111\n00111\n00101";
		const image = "11111\n10001\n10001\n10001\n10001\n11111";

		const lines = image.split("\n");
		const matrix = lines.map((line) => Array.from(line).map((c) => c === "0" ? false : true).reverse()).reverse();
		// amun.log(matrix);

		const display = new TacticPixelDisplay(World.FriendlyRobots, matrix, [4, 5]);
		display.run();
	}
}
